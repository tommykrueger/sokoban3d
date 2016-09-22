<?php

/**
 * Imports CSV data to MySQL database
 */

include_once('components/config.php');
include_once('components/database.php');
include_once('components/ganon.php');
include_once('components/simple_html_dom.php');

class Import {
	
	public $table = 'incidents';
			
	private $filename = '';
	private $content = array();
	private $db = '';

	private $tableHeader = array();
	private $tableRows = array();

	public function __construct() {
		$this->db = Database::getInstance();
	}


	public function importWebsites () {

		$websites = array(
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2000',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2001',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2002',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2003',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2004',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2005',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2006',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2007',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2008',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2009',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2010',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2011',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2011',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2012',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2012',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2013',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2013',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2014',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2014',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2015',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2015',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2016',
			'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_July%E2%80%93December_2016',
		);

		foreach ($websites as $website) {

			$this->importFromWebsite($website);

		}

	}


	/*
	 * Import data from website(s)
	 */ 
	public function importFromWebsite( $url = null ) {

		var_dump('starting file import from data ' . $url);

		if (empty($url)) {
			exit('The File does not exist');
		}


		$entries = array();

		$fields = array(
			'date', 
			'type', 
			'dead', 
			'injured',
			'location',
			'description',
			'perpetrator',
			'lat',
			'lon'
		);


		$html = file_get_html($url);

		if (!$html) return;

		foreach ($html->find('#mw-content-text table.wikitable') as $element) {

			$month = trim($element->prev_sibling()->first_child()->plaintext);
			$rows = $element->find('tr');

			foreach($rows as $row) {

				$i = 0;
				$entry = array();
				$columns = $row->find('td');

				foreach($columns as $column) {

					$txt = '';

					if (isset($fields[$i])) {

						//if (count($column->children)) {

							//foreach($column->children as $child) {
								//$txt .= $child->plaintext;
							//}

						//} else {
							
							$txt = $column->plaintext;

						//}

					}

					$entry[$fields[$i]] = $txt;

					$i++;
				}

				$entries[] = $entry;

				$sqlColumns = '';
				$sqlValues = '';

				foreach ($entry as $key => $value) {

					if ($key == 'date') {
						$value .= ' ' . $month;
					}

					$sqlColumns .= '' . $key . ',';
					$sqlValues .= '"' . mysql_real_escape_string($value) . '",';
				}

				$sqlColumns = rtrim($sqlColumns, ",");
				$sqlValues = rtrim($sqlValues, ",");

				if (strlen($sqlColumns) > 5 && strlen($sqlValues) > 5) {
					$sql = 'INSERT INTO '. $this->table .' ('. $sqlColumns .') VALUES('. $sqlValues .')';

					// var_dump($sql);
					$this->db->query($sql);
				}
				

    	}

		}

		// var_dump($entries);

	}



	private function prepareTableHeader() {
		$header = $this->content[0];

		foreach($header as $h) {
			$headerColumn = '';
			$headerColumn = str_replace('. ', '_', $h);
			$headerColumn = str_replace(' ', '_', $headerColumn);
			$headerColumn = strtolower($headerColumn);

			$this->tableHeader[] = $headerColumn;
		}

		$columns = ' id INT NOT NULL AUTO_INCREMENT';
		foreach( $this->tableHeader as $header ) {
    	$columns .= ', `'. $header .'` VARCHAR(255)';
		}
		$columns .= ', PRIMARY KEY( id )';

		$sql = 'CREATE TABLE IF NOT EXISTS '. $this->table .' ('. $columns .')';

		var_dump($sql);

		// If the table exists delete it first
		// $this->db->query('DROP TABLE IF EXISTS '. $this->table .'');
		$this->db->query($sql);
	}

	private function insertRows() {

		$i = 0;
		foreach( $this->content as $row ) {
			if ($i > 0 && count($row) == count($this->tableHeader) ) {
				$values = ''; 

				$values = ' \'\' ';
				foreach( $row as $column ) {
					$values .= ', \'' . mysql_real_escape_string($column) . ' \' ';	
				}

				$sql = 'INSERT INTO '. $this->table .' VALUES('. $values .')';

				// var_dump($sql);
				$this->db->query($sql);
			}

			$i++;
		}		

		return true;
	}

}

?>