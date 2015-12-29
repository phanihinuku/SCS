<?php


require_once("db-settings.php"); //Require DB connection
require "Services/Twilio.php";

$scheduler_id = -1;
$complete = false; //schedule completed = false by default

/* send_message for given recipients */

function send_to_recipients( $recipients , $message, $sch_id) 
{
	GLOBAL $scheduler_id;
	GLOBAL $complete;
	$results = array();
	$scheduler_id = $sch_id;
	//die( json_encode($recipients) );
	
	IF( ISSET($recipients->values) )
	{
		foreach( $recipients->values as $recipient )
		{
			$result = send_message($recipient,$message);
			array_push( $results , $result );
		}
		
		
		if($complete) complete_schedule( $sch_id , "CMP"); 
		else complete_schedule( $sch_id , "FLD"); //If all number(s) fail, scheduler status is failed
		
		return $results;
	}
}


function send_message($recipient,$message)
{
 
 GLOBAL $complete;
 
$account_sid = 'AC8146d622eccaf32eb123d59bb8fc071e'; 
$auth_token = '6c3486c7995c9f10ee3e3f659ce63b3d'; 
$status_reason = "";

$client = new Services_Twilio($account_sid, $auth_token); 
 try {
		$sms = $client->account->messages->sendMessage("+12513335687", "+1".$recipient->phone_mobile, $message);
		
		//No exception, log successfull entry in the table
		$status = "CMP"; //Log CMP => Completed Status
		$complete = true;
	}
catch (Exception $e) {

		$status = "FLD"; //Log Failed => Failed Status
		$status_reason = "".$e->getMessage();
	}
	
	
	if ( log_history( $recipient, $status ) ) 	return array( "recipient" => $recipient , "status" => $status , "failed_reason" => $status_reason );
	else return array( "recipient" => $recipient , "status" => "FLD" , "failed_reason" => "Message sent, but failed to update database" );
	
}


function log_history( $recipient , $status )
{
	GLOBAL $scheduler_id;
	$query = "INSERT INTO history
		(`scheduler_id`, `phone`, `name`, `status`) 
		VALUES 
		(:scheduler_id, :phone, :name, :status);";
	
	$db = pdoConnect();
	
	$sqlVars = array();

		$sqlVars[':scheduler_id'] = $scheduler_id;
		$sqlVars[':phone'] = $recipient->phone_mobile;
		$sqlVars[':name'] = $recipient->name;
		$sqlVars[':status'] = $status;
		
		$stmt = $db->prepare($query);
				
		return $stmt->execute($sqlVars);
		
}


function complete_schedule( $sch_id , $status)
{
	//$status = "CMP"; //CMP => Completed Status
	
	$query = "UPDATE scheduler SET execution_status = '".$status."' WHERE id = ".$sch_id;
	
	$db = pdoConnect();
			
	$stmt = $db->prepare($query);
				
	$stmt->execute();
}

?>