<?php

require_once("db-settings.php"); //Require DB connection
require("scheduler_functions.php"); //Require scheduler functions for Immediate Job

	/* Parameters would be sent in this manner
	{
		days : [1,2,3,4,5,6,7] , //Sunday = 1 , Monday = 2 , Tuesday = 3 , etc....
		months : [1,2,3.....12] , //January = 1 , February = 2, March = 3..... December = 12
		dates : [1,2,3,4......31] //Dates of that month	
	}
	*/
	
/* Definitions */
	$days = array("","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	$months = array("","January","February","March","April","May","June","July","August","September","October","November","December");

$data = json_decode("{}");
	
IF(ISSET($_POST['data'])) $data = json_decode($_POST['data']); //Decode JSON data

IF(ISSET($data->job_name)) echo json_encode( create_job( $data ) ); //Send data json if set

function create_job( $obj )
{
	GLOBAL $data;
	$data = $obj;
	$job_name = $data->job_name;
	$frequency = $data->frequency;
	$message = $data->message;
	$recipients = $data->recipients;

	$params = json_decode("{}");

	$params->days = $data->param_days;
	$params->dates = $data->param_dates;
	$params->months = $data->param_months;
	//$params = $data->parameters;

	//die( json_encode($params) );

			if($frequency != 'I') $start = get_php_timestamp($data->start_date);
			//$end = get_php_timestamp($data->end_date);

	$recur = $data->recur;
	$schedules = array();

	if($frequency == 'I') //Immediately
		{
			$start = strtotime("now");
			array_push( $schedules , strtotime("now") );
		}
	elseif ($frequency == 'O') // One Time
		{
			array_push( $schedules , $start );
		}
	elseif($frequency == 'D') //Daily with recurrence
		{
			//array_push($schedules,$start);
			//$date = $start;

			for($i=0;$i<$recur;$i++)
			{
				$date = add_js_timestamp($data->start_date, $frequency,$i);
				array_push( $schedules , $date );
			}
		}
	elseif($frequency == 'W') //Weekly with recurrence	
		{
			
			for($i=0;$i<count($params->days);$i++) //Loop through all days
			{
				$start_week_date = get_start_day( $params->days[$i] , $start);
				
				for($j=0;$j<$recur;$j++)
				{
					$date = add_js_timestamp( date_string($start_week_date) , $frequency,$j); //Add weekly count
					array_push( $schedules , $date );
				}
				
			}		
		}
	elseif($frequency == 'M') //Monthly with days OR on specific days
		{		
				for($i=0;$i<count( $params->months) ;  $i++)
				{
					
					for($j=0;$j< count($params->dates) ; $j++)
					{
						if( $params->dates[$j] > 31 ) 
						{
							$str = "";
							
							//Its a special date, use it intelligently !!
							//String format ==> 'Last Sunday of December 2015'
							switch($params->dates[$j])
							{							
								case 41: //First Day
									$str = "First ";
								Break;
								case 42: //Second Day
									$str = "Second ";
								Break;
								case 43: //Third Day
									$str = "Third ";
								Break;
								case 44: //Fourth Day
									$str = "Fourth ";
								Break;	
								case 45: //Last Day
									$str = "Last ";
								Break;							
							}
							
							$day = $str;
							
							for($k=0;$k < count( $params->days ); $k++ )
							{
								$str = "";
								$str = $day.$days[$params->days[$k] ];
								$str  = $str." of ";
								$str  = $str."".$months[ $params->months[ $i ] ];
								$str  = $str."".get_year($data->start_date);
								array_push( $schedules , strtotime($str) );
								
							}
							
							
							
						}
						else
						{
							$date = get_month_date( $params->dates[$j] , $params->months[$i] );
							array_push( $schedules , $date );
						}			
					}
				}
		}

	//Save entries to the Database

	$db = pdoConnect();

	$query = "INSERT INTO jobs
			(`name`, `frequency`, `recur`, `message`, `recipients`, `start_date`, `parameters`, `user_id`) 
			VALUES 
			(:name, :frequency, :recur, :message, :recipients, :start_date, :parameters, :user_id );";
			
			$sqlVars = array();
			
			$obj_recipients = json_decode("{}"); //Create Object
			$obj_recipients->values = $recipients;

			$sqlVars[':name'] = $job_name;
			$sqlVars[':frequency'] = $frequency;
			$sqlVars[':recur'] = $recur;
			$sqlVars[':message'] = $message;
			$sqlVars[':recipients'] = json_encode($obj_recipients);
			$sqlVars[':start_date'] = date_string($start);
			$sqlVars[':parameters'] = json_encode($params);
			$sqlVars[':user_id'] = ""; //$this->userID;
			
			
			//die( json_encode($sqlVars) )  ;
			
			$stmt = $db->prepare($query);
					
			$stmt->execute($sqlVars);
			
			$job_id = $db->lastInsertId();
			

		
	$query = "INSERT INTO scheduler
			(`job_id`, `execution_date`) 
			VALUES 
			(:job_id, :execution_date);";
			
			$sqlVars = array();	
			$sqlVars[':job_id'] = $job_id;
		
		
		$schedule_id = -1;
		$schedule_strings = array();
	foreach($schedules as $schedule)
	{
		$sqlVars[':execution_date'] = date_string($schedule);
		$stmt = $db->prepare($query);				
		$stmt->execute($sqlVars);
		$schedule_id  = $db->lastInsertId();
		array_push($schedule_strings, array( "id" => $schedule_id , "date" => date_string($schedule) ) );
		
		//echo date_string($schedule)."\n";
	}


	//***** Return output ******//
	$history = array();

	if( $frequency == 'I' ) //Immediate Job
	{ $history = send_to_recipients( $obj_recipients , $message , $schedule_id )  ; }
		
	return array( "job_id" => $job_id , "schedules" => $schedule_strings , "history" => $history );
}



//********** End of Main execution ***********//


//********** Start of functions ***********//
function get_year($start_date)
{
	return substr($start_date , 0 , 4);
}

function get_month_date( $day , $month )
{
	GLOBAL $data ;
	$yyyy = substr($data->start_date , 0 , 4);
	return mktime(0,0,0, $month  , $day, $yyyy);
}

function date_string($date)
{
	return "".date("Y-m-d H:i:s",$date);
	
}

function get_start_day( $day , $start)
{
	GLOBAL $days;
	
	for($i=0;$i<7;$i++)
	{
		$date = add_js_timestamp( date_string($start) ,"D",$i); //Ad one day and see if it is the appropriate Day like MOnday , Tuesday etc...
		if( $days[$day] == date("l", $date) ) return $date;
	}
}

function get_php_timestamp($js_date)
{
	//return $js_date;
	
	//Format = 2015-12-10T07:01:42.340Z
	$yyyy = substr($js_date , 0 , 4);
	$mm = substr($js_date , 5 , 2);
	$dd = substr($js_date , 8 , 2);
	
	$H = substr($js_date , 11 , 2);
	$m = substr($js_date , 14 , 2);
	$s = substr($js_date , 17 , 2);
	
//die ( " Hour = ".$H." Minute = ".$m." second = ".$s." Day = ".$dd." Month = ".$mm." Year = ".$yyyy );
	
	//mktime(H, m, s, M, D, YYYY);
	return mktime($H, $m, $s, $mm  , $dd, $yyyy);
}

function add_js_timestamp($js_date,$factor,$count)
{
		//Format = 2015-12-10T07:01:42.340Z
	$yyyy = substr($js_date , 0 , 4);
	$mm = substr($js_date , 5 , 2);
	$dd = substr($js_date , 8 , 2);
	
	$H = substr($js_date , 11 , 2);
	$m = substr($js_date , 14 , 2);
	$s = substr($js_date , 17 , 2);
	
	
	switch($factor)
	{
		case 'O' : //One Time
			//Whatever user passes would be the date and time !!
			break;
		case 'D': //Daily
			$dd = $dd - 0 + $count;
		break;
		
		case 'W': //Weekly
			$dd = $dd - 0 + (7*$count); //Week - 7 days
		break;
		
		case 'B': //Bi-Weekly
			$dd = $dd - 0 + 14; //Bi-Weekly 14 Days
		break;
		
		case 'M': //Monthly
			$mm = $mm - 0 + $count;
		break;
		
		case 'Y': //Yearly
			$yyyy = $yyyy - 0 + $count;
		break;
	}
	
	//return " Hour = ".$H." Minute = ".$m." second = ".$s." Day = ".$dd." Month = ".$mm." Year = ".$yyyy;
	
	//die($dd);
	//mktime(H, m, s, M, D, YYYY);
	return mktime($H, $m, $s, $mm  , $dd, $yyyy);
	
}

//********** End of functions ***********//

?>