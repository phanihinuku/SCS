<?php
require_once 'Excel_php/reader.php';
require_once("db-settings.php"); //Require DB connection
require_once("create_job.php"); //Require creation of jobs


//Read Excel here !!
$excel = new Spreadsheet_Excel_Reader();
$excel->setOutputEncoding('CP1251');

$excel->read($_FILES["contacts"]["tmp_name"]);

$sheets = $excel->_ole->sheets; //get active sheets 0 - first sheet

$jobs = array();	
for( $i = 1 ; $i < $sheets[0]['numRows'] && sizeof( $sheets[0]['cells'][$i] ) != 0 ; $i++ ) //Start reading from second row
	{
		$job = array();
		$obj = json_decode("{}");
		$recipient = json_decode("{}");
		for($j=0;$j<6;$j++) //We have 6 columns ==> Phone	Name	Message	 Immediate(Y/N)	 Date	Time
		{
			if(ISSET($sheets[0]['cells'][$i][$j])) 
			{
				if($j == 0) //Phone
					$recipient->phone_mobile = $sheets[0]['cells'][$i][$j];
				elseif($j == 1) //Name
					$recipient->name = $sheets[0]['cells'][$i][$j];
				elseif($j == 2) //Message
					$obj->message = $sheets[0]['cells'][$i][$j];
				elseif($j == 3) //Immediate(Y/N)
					{
						if($sheets[0]['cells'][$i][$j] == "Y" ) $obj->frequency = "I"; //Immediate Job
						else $obj->frequency = "O"; //Other Time
					}
				elseif($j == 4) //Date
					{
						$obj->start_date = 	date( "Y-m-d" , ($sheets[0]['cells'][$i][4] - 25569) * 86400 );
						//die ( "".date( "Y-m-d H:i:s" , $obj->start_date ) );
					}
				elseif($j == 5) //Time
					{
						$obj->start_date = 	$obj->start_date." ".$sheets[0]['cells'][$i][$j].":00";
					}
			}	
		}
		$obj->job_name = "Schedule through file upload";
		$obj->recipients = array( $recipient );
		$obj->param_days = array( );
		$obj->param_months = array( );
		$obj->param_dates = array( );
		$obj->recur = 1;
		$job = create_job( $obj );
		array_push($jobs,$job);
	}

echo json_encode( array( "jobs" => $jobs ) );	
	
?>