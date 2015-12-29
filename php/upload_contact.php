<?php
/*
Upload Locations through Excel
*/

require_once 'Excel_php/reader.php';
require_once("../models/config.php");
require_once("../models/admin_functions.php");

// Request method: GET
//$ajax = checkRequestMode("get");

if (!securePage(__FILE__)){
    apiReturnError($ajax);
}

setReferralPage(getAbsoluteDocumentPath(__FILE__));

?>

<!DOCTYPE html>
<html lang="en">
  <?php
  	echo renderAccountPageHeader(array("#SITE_ROOT#" => SITE_ROOT, "#SITE_TITLE#" => SITE_TITLE, "#PAGE_TITLE#" => "Dashboard"));
  ?>

  <body>
	
	<script src="../js/upload-location.js"></script>
	
    <div id="wrapper">

      <!-- Sidebar -->
        <?php
          echo renderMenu("api-docs-view");
        ?>  

      <div id="page-wrapper">
	  	<div class="row">
          <div id='display-alerts' class="col-lg-12">
          
          </div>
        </div>
        
		<div class="row">
        <div class="col-md-10">
		  <div class="panel panel-default">
			  <div class="panel-heading">
				<h3>Upload Locations</h3>
			  </div>
			  
			  <div class="panel-body">
			  
			  <?php
				$city="";
				$cityId="";
				$locations = array();
				$duplicateLoc  = false;
				
				if(ISSET($_FILES["locationExcel"])) new_excel_upload();
				else if(ISSET($_POST["save_excel"])) save_excel($_POST["save_excel"]);
								
				function new_excel_upload()
				{
					Global $locations;
					Global $duplicateLoc;
					Global $city;
					$date_obj = new DateTime();
					$datetime = $date_obj->format('Ymd_his');

					$target_dir = "excel_upload/";
					$target_file = $target_dir . "Locations_" . $datetime . ".xls" ;
					
					if ( move_uploaded_file($_FILES["locationExcel"]["tmp_name"], $target_file) ) {
					//echo "File is valid, and was successfully uploaded.\n";
					} else {
						echo "File upload was not successfull, please try again\n";
					}
					
					read_excel($target_file);
					
					$str  = "";
					if($duplicateLoc)
					{
						echo "<div class=\"alert alert-danger\"> Highlighted(in red) localities already exist , remove them and upload the excel again ! </div>";
						unlink($target_file);
					}
					else
					{
						$str = "<div class=\"alert alert-success\"> Following localities are read from the excel for city \"".$city."\", click on SAVE to save the localities</div>";
						$str = $str."<br><form role=\"form\" action=\"upload_locations.php\" method=\"post\" enctype=\"multipart/form-data\" >";
						$str = $str."<input type=\"hidden\" name=\"save_excel\" value=\"".$target_file."\" />";
						$str = $str."<button type=\"submit\" class=\"btn btn-success\" id=\"btn_locality_save\">SAVE</button>";
						$str = $str."</form>";
					}
					
					$str .= "<br><table class=\"table\"> <thead><tr><th>Locality</th></tr></thead> <tbody>";
						
					for($i=0 ; $i<count($locations);$i++)
					{
						if($locations[$i][1]) $str .= "<tr class=\"danger\"><td>".$locations[$i][0]."</td></tr>";
						else $str .= "<tr><td>".$locations[$i][0]."</td></tr>";
					}
					$str .= "</tbody></table>";
					echo $str;
				
				}
				
				
				function save_excel($target_file)
				{
					Global $locations;
					Global $duplicateLoc;
					Global $cityId;
					Global $city;
					read_excel($target_file);
					
					$db = pdoConnect();
						
						$query = "INSERT INTO `locality` (`cityID`,`localityText`) VALUES ";
						
					for($i=0;$i<count($locations);$i++)
					{
						if($i > 0) $query .= ",";
						$query .= "(".$cityId." , '".$locations[$i][0]."')"; 
					}
					
					$stmt = $db->prepare($query);
					
					if($stmt->execute()) echo "<div class=\"alert alert-success\"> Localities are successfully added for city \"".$city."\" </div>";
					else echo "<div class=\"alert alert-danger\"> Errors while saving localities ! !<br>Please contact admin</div>";
					
					unlink($target_file);
				}
			  
				
				function read_excel($target_file)
				{
					Global $locations;
					Global $duplicateLoc;
					Global $city;
					Global $cityId;
					
					$data = new Spreadsheet_Excel_Reader();
					$data->setOutputEncoding('CP1251');

					$data->read($target_file);

					$sheets = $data->_ole->sheets; //get active sheets 0 - first sheet
					
					$city = $sheets[0]['cells'][0][1];
					//echo "City = " . $city;
					
					if($city == "-- Select --") die("Select an appropriate city and upload the excel again !!");
					else
					{
							$cityId = getCityId($city);
							
							if($cityId == -1)
							{
								unlink($target_file);
								die("City \"".$city."\" not found in the database !");
							}
					}
					
					$j = 0;
					for( $i = 2 ; $i < $sheets[0]['numRows'] && sizeof( $sheets[0]['cells'][$i] ) != 0 ; $i++ ) //Locations starts from 3rd row
					{
						if( !ISSET($sheets[0]['cells'][$i][0]) || $sheets[0]['cells'][$i][0] == "" || $sheets[0]['cells'][$i][0] == null ) return;
						
						$locations[$j] = array();
						$locations[$j][0] = $sheets[0]['cells'][$i][0];
						$locations[$j][1] = locationExist( $cityId  , $locations[$j][0] );
						if( $locations[$j][1] ) $duplicateLoc = true;
						$j++;
					}			
					
				}

					function locationExist( $cityId  , $location )
					{
						$db = pdoConnect();
						
						$query = "SELECT id from `locality` WHERE cityID = '".$cityId ."' AND localityText = '".$location."'";
						//echo $query;
						$stmt = $db->prepare($query);
						
						if (!$stmt->execute()){
							// Error: column does not exist
							return false;
						}
						else {
							$row = null;
							$row = $stmt->fetch();
							
							if(!$row) return false;
							}
						
						return true;
					}

					
					function getCityId($cityName)
					{
						$db = pdoConnect();
						
						$query = "SELECT id from `city` WHERE cityName = '".$cityName."'";
						//echo $query;
						$stmt = $db->prepare($query);
						
						if (!$stmt->execute()){
							// Error: column does not exist
							return -1;
						}
						else {
							$row = null;
							$row = $stmt->fetch();
							
							if(!$row) return -1;
							else return $row["id"];
							}
							
						return -1;
						
					}
			  
			  
			  ?>		  
			   
			  				
			  </div>
			  
			  <div class="panel-footer">
								
			  </div>
		  </div>
		</div>
        </div>

      </div><!-- /#page-wrapper -->

    </div><!-- /#wrapper -->

	<script>
        $(document).ready(function() {       
          alertWidget('display-alerts');
		});
	</script>
  </body>
</html>


