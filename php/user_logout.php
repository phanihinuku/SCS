<?php
// Begin the session
session_start();

// Unset all of the session variables.
session_unset();

// Destroy the session.
session_destroy();


echo json_encode( array( "message" => "You are now logged out. Please come again" , "success" => true ) );

?>