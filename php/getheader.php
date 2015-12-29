<?php
require_once("db-settingsheader.php"); //Require DB connection

$db = pdoConnect();

//$query = "SELECT  * from `contacts` WHERE id > 0  limit 10";
$query = "SELECT column_name,column_comment FROM `COLUMNS` WHERE TABLE_SCHEMA = '"."scsv1"."' and table_name = 'contacts'";
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
?>