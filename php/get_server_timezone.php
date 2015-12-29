<?php


echo json_encode( array( "timezone" => date('T', strtotime("now") ), "offset" =>  date('Z', strtotime("now") ) ) );


?>