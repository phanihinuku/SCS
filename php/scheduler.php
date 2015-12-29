<?php

/* This  PHP will run regularly at regular intervals */

require_once("db-settings.php"); //Require DB connection
require("scheduler_functions.php"); //Require scheduler functions

// Constants
$status_new = "NEW";
$status_failed = "FLD";

//Current Date & time
$curr_dt_time = "".date("Y-m-d H:i:s", strtotime("now") ); //Get current Date & Time

//die( $curr_dt_time  );

//Select Scheduler entries that are pending
$db = pdoConnect();

$query = "Select sch.id, sch.job_id, job.message, job.recipients from scheduler as sch INNER JOIN jobs as job ON sch.job_id = job.id WHERE sch.execution_status IN ('".$status_new."','".$status_failed."') AND sch.execution_date <= '".$curr_dt_time."' ";

$stmt = $db->prepare($query);
$stmt->execute();

$row = $stmt->fetch();

while($row)
{
		//echo "<br>".json_encode($row);
		send_to_recipients( json_decode( $row['recipients'] ) , $row['message'] , $row['id'])  ;
		
		$row = $stmt->fetch();
	
}

?>