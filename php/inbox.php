<?php

require_once("db-settings.php"); //Require DB connection

/*
Output

{
	"CMP" : [ {"recipient":"91234","status":"CMP","message":"Some message","date":"2015-12-31 24:59:59"},..... ] , //Completed
	"FLD" : , // Failed
	"CNC" : , // Cancelled
	"NEW" : 	 //Scheduled
}
*/


$completed = array();
$failed = array();
$cancelled = array();
$scheduled = array();


//Select Scheduler entries that are pending
$db = pdoConnect();

$query = "Select sch.id, sch.execution_status, job.message, job.recipients , sch.last_updated from scheduler as sch INNER JOIN jobs as job ON sch.job_id = job.id";

$stmt = $db->prepare($query);
$stmt->execute();

$row = $stmt->fetch();

while($row)
{
		//echo "<br>".json_encode($row);
		if( $row['execution_status'] == "CMP" OR $row['execution_status'] == "FLD" )
		{
			
			$query2 = "Select phone , name , status , last_updated_on  from history WHERE scheduler_id = ".$row['id'];

			$stmt2 = $db->prepare($query2);
			$stmt2->execute();

			$row2 = $stmt2->fetch();
			
			while($row2)
			{
				if( $row['execution_status'] == "CMP" ) array_push( $completed , array( "recipient_name" => $row2['name'] ,"recipient_phone" => $row2['phone'] , "status" => $row2['status'] , "message" => $row['message'] , "date" => $row2['last_updated_on'] ) );
				elseif ( $row['execution_status'] == "FLD" )   array_push( $failed , array( "recipient_name" => $row2['name'] ,"recipient_phone" => $row2['phone'] , "status" => $row2['status'] , "message" => $row['message'] , "date" => $row2['last_updated_on'] ) );
				$row2 = $stmt2->fetch();
			}
			
		}
		else
		{
				$obj = json_decode( $row['recipients'] );
				$recipients = $obj->values;
				
				foreach( $recipients as $recipient )
				{
					//die ( "".json_encode($recipient) );
					if( $row['execution_status'] == "CNC" ) array_push( $cancelled , array( "recipient_name" => $recipient->name ,"recipient_phone" => $recipient->phone_mobile , "status" => $row['execution_status'] , "message" => $row['message'] , "date" => $row['last_updated'] ) );
					elseif( $row['execution_status'] == "NEW" ) array_push( $scheduled , array( "recipient_name" => $recipient->name ,"recipient_phone" => $recipient->phone_mobile , "status" => $row['execution_status'] , "message" => $row['message'] , "date" => $row['last_updated'] ) );
				}

		}
		
		$row = $stmt->fetch();
	
}


echo json_encode( array( "scheduled" => $scheduled , "cancelled" => $cancelled , "completed" => $completed , "failed" => $failed ) );


?>