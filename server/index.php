<?php 
	
	include_once('components/zipfile.php');
	include_once('import.php');
	include_once('export.php');

	$action = isset( $_REQUEST['action'] ) ? $_REQUEST['action'] : '';
	$table = isset( $_REQUEST['table'] ) ? $_REQUEST['table'] : '';
	$url = isset( $_REQUEST['url'] ) ? $_REQUEST['url'] : '';

	if ($action === 'import') {

		if ($url) {
			
			$filename = explode('/', $url);

			if (strpos($url, '.zip') !== false) {

				$zipfile = new Zipfile($url, $filename[count($filename)-1]);
				$zipfile->save();

				if ($file = $zipfile->unpack()) {

					// perform the import
					$import = new Import();
					$import->table = $table;
					$import->importFromFile($file);
				}	

			} else {

				// there is no zip file but normal csv
				$import = new Import();
				$import->table = $table;
				$import->importWebsites();

			}
		}

	} elseif ($action === 'export') {

		$export = new Export($table);
		$export->exportAll();

	}

	$urls = [
		'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_2010',
		'https://en.wikipedia.org/wiki/List_of_terrorist_incidents,_January%E2%80%93June_2011'
	];

?>

<html>
<head>
	<title>TerrorAttacks Backend</title>

	<style>

		table {
			width: 80%;
			}
		table th {
			background-color: #f9f9f9;
			}
		table th,
		table td {
			padding: 10px;
			text-align: left;
			border: 1px solid #f0f0f0;
			}

	</style>

	<script type="text/javascript" src="../assets/jquery.js"></script>
	<script type="text/javascript">
		jQuery(document).ready(function($){

			var count = 0;

			$('#prepare-btn').on('click', function(e){
				e.preventDefault();

				var url = $(this).attr('href');
				loadAsynch(url, count);

			});


			function loadAsynch (url, c) {

				$.ajax({
					url: url,
					data: {count: c},
					dataType: 'json',
					success: function(d){
						console.log(d);

						if (!d.stopped) {

							var s = d.count;
							setTimeout(function() { loadAsynch(url, s); }, 100);

						}

					}
				});

			}


		});

	</script>

</head>
<body>

	<div id="content">
		<h1>Globe Terror Attacks Backend</h1>
		
		<p>Import non state terror incidents from wikipedia.</p>
	</div>

	<table cellspacing="0" cellpadding="0">

		<tr>
			<th>Type</th>
			<th>Url</th>
			<th>Table</th>
			<th>Action</th>
		</tr>
		<tr>
			<td>Wiki</td>
			<td><?php echo $urls[0]?></td>
			<td>incidents</td>
			<td>
				<a href="index.php?action=import&table=incidents&url=<?php echo $urls[0]?>">Import</a>
				<a href="index.php?action=export&table=incidents">Export</a>

				<a href="datasetup.php" id="prepare-btn">Prepare Data</a>

			</td>
		</tr>
		
	</table>

</body>
</html>