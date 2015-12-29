<?php

require_once("db-settings.php"); //Require DB connection

$db = pdoConnect();

//$query = "SELECT  * from `contacts` WHERE id > 0  limit 10";
// $query = "SELECT * FROM `contacts` LIMIT 10";
$query = $_POST['query'];
$query = str_replace("% ", "%", $query);

//$query="SELECT  * from `contacts` where name LIKE '%33%'";

$stmt = $db->prepare($query);
$stmt->execute();

$row = $stmt->fetch();

$json = "[";
while($row){
	$json = $json.json_encode( $row );
	
			$row = $stmt->fetch();
	
	if(!empty($row)) {
		$json = $json.",";
	}
}
$json = $json."]";

echo $json;


//echo $query;
?>
