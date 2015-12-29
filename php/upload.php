<?php
require_once 'Excel_php/reader.php';
require_once("db-settings.php"); //Require DB connection
$no_of_colummns = 34;

//if(!ISSET($_POST["contacts"])) die('Upload excel and then submit');

		//Read Excel here !!
		$data = new Spreadsheet_Excel_Reader();
		$data->setOutputEncoding('CP1251');		

		$data->read($_FILES["contacts"]["tmp_name"]);
		
		$sheets = $data->_ole->sheets; //get active sheets 0 - first sheet
				
		$headers = array();
		$query_col = "( ";
		$i = 0; //Read first row headers
		for($j=0;$j<$no_of_colummns;$j++)
		{
			if(ISSET($sheets[0]['cells'][$i][$j]))	
				{
					$sheets[0]['cells'][$i][$j] = str_replace("_ ","_",$sheets[0]['cells'][$i][$j]);
					$sheets[0]['cells'][$i][$j] = str_replace(" _","_",$sheets[0]['cells'][$i][$j]);
					$headers[ $j ] =  $sheets[0]['cells'][$i][$j];
					
					if($j!=0) $query_col .= " , ";
					$query_col .= "`".$headers[ $j ]."`";
				}
		}
		$query_col .= ") ";

		$contacts = array();
		$query_ins = "";
		for( $i = 2 ; $i < $sheets[0]['numRows'] && sizeof( $sheets[0]['cells'][$i] ) != 0 ; $i++ ) //Start reading from third row
		{
			if($i != 2) $query_ins .= " , ";
			$query_ins .= "( ";
			$contact = array();
			for($j=0;$j<$no_of_colummns;$j++) 
			{
				if(ISSET($sheets[0]['cells'][$i][$j]))
				{
					if( $headers[$j] == "contact_date" || $headers[$j] == "check_date" ) //Dates
						$contact[ "".$headers[$j] ] = convert_php_date( $sheets[0]['cells'][$i][$j] );
					else $contact[ "".$headers[$j] ] = $sheets[0]['cells'][$i][$j];
				}
				else $contact[ "".$headers[$j] ] = "";
				
				IF($j != 0) $query_ins .= " , ";
				$query_ins .= "'".$contact[ "".$headers[$j] ]."'";
			}						
			$query_ins .= " ) ";
			array_push($contacts,$contact);
			
			if(ISSET($contact["external_id"]) OR $contact["external_id"] > 0) //External ID already exists, delete and insert
					{
						$db = pdoConnect();
						$query  = "DELETE FROM contacts WHERE `external_id` = :external_id";
						//die( $query );
						
						
						try{
							$stmt = $db->prepare($query);	
							
							$stmt->bindParam(":external_id", $contact["external_id"], PDO::PARAM_INT);
							$stmt->execute();
							
						}catch(Exception $e)
						{
							die("".$e->getMessage());
						}
					}
		}	
		
		
		$db = pdoConnect();
		
		$query  = "INSERT INTO contacts ".$query_col." VALUES ".$query_ins;
		
		//die( $query );
		
		$stmt = $db->prepare($query);
			
		$stmt->execute();
		
	
		echo json_encode( array("headers" => $headers , "contacts" => $contacts) );
		
						
			
function convert_php_date( $date )
{
	//Excel date = MM/DD/YYYY
	if($date > 25569 ) $php_date = date( "Y-m-d" , ($date - 25569) * 86400 );
	else $php_date =  substr($date , 6 , 4)."-".substr($date , 3 , 2)."-".substr($date , 0 , 2);
	
	return $php_date;
}

?>