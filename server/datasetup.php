<?php 

include_once('components/config.php');
include_once('components/database.php');

class DataSetup {
		
	private $filename = '';
	private $db = '';

	private $table = 'incidents';


	public function __construct () {

		$this->db = Database::getInstance();
		$this->count = (int) $_REQUEST['count'];
		$this->prepare();

	}


	public function prepare() {

		$data = $this->db->query('SELECT * FROM '. $this->table .' LIMIT ' . $this->count . ', 1');

		if ($data) {

			foreach ($data as $d) {

				$location = $this->getLatLon($d);

				$this->db->query(
					'UPDATE '. $this->table .' SET lat="' . $location['lat'] . '", lon="' . $location['lon'] . '" WHERE id = ' . $d['id'] 
				);

				$this->count += 1;

				$arr = array(
					'stopped' => false,
					'count' => $this->count
				);

				$toReturn = json_encode($arr);

				echo $toReturn;

			}

		}

	}


	private function getLatLon( $d ) {

		$new = array('lat' => 0, 'lon' => 0);

		if (isset($d['location']) && !empty($d['location'])) {

			$location = urlencode($d['location']);
			$url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' . $location . '&sensor=false';

	  	$geocodeStats = file_get_contents($url);
			$outputDeals = json_decode($geocodeStats);

			// var_dump($url);
			// var_dump($outputDeals);
			
			if (is_array($outputDeals->results) && count($outputDeals->results)) {

				$latLng = $outputDeals->results[0]->geometry->location;

				$lat = $latLng->lat;
				$lng = $latLng->lng;	

				$new = array(
		    	"lat" => $lat,
		    	"lon" => $lng
		    );

			}

		}

    return $new;
	}


}


new DataSetup();


?>