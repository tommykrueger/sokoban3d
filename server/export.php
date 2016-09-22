<?php 

include_once('components/config.php');
include_once('components/database.php');

class Export {
		
	private $filename = '';
	private $content = array();
	private $db = '';

	private $table = '';
	private $tableHeader = array();
	private $tableRows = array();


	public function __construct( $table = 'planets' ) {
		$this->table = $table;
		$this->db = Database::getInstance();
	}

	public function exportAll() {
		$this->exportIncidents();
	}


	public function exportIncidents() {

		$i = 0;
		$entries = array('2010' => array());
		$data = $this->db->query('SELECT * FROM '. $this->table .'');

		foreach ($data as $d) {

			if ( (int) $d['dead'] > 0 && $d['lat'] != 0) {

				$arr = array();
				$arr['id'] = (int) $d['id'];
				$arr['b'] = (int) $d['dead'];

				$arr['lat'] = $d['lat'];
				$arr['lon'] = $d['lon'];

				$arr['l'] = $d['location'];
				$arr['t'] = $d['type'];

				$entries['2010'][] = $arr;

				$i++;

			}
			
		}

		file_put_contents('../data/incidents.json', json_encode($entries));
	}

}


?>