<?php

require_once("db-settings.php"); //Require DB connection

/*** begin our session ***/
session_start();

$data = json_decode( $_POST['data'] );
$success = false;
$role = "";
$display_name = "";

/*** check if the users is already logged in ***/
if(isset( $_SESSION['user_id'] ))
{
    $message = 'A user has already logged into this session';
}
/*** check that both the username, password have been submitted ***/
elseif(!isset( $data->username, $data->password))
{
    $message = 'Please enter a valid username and password';
}
/*** check the username is the correct length ***/
elseif (strlen( $data->username) > 20 || strlen($data->username) < 4)
{
    $message = 'Incorrect Length for Username';
}
/*** check the password is the correct length ***/
elseif (strlen( $data->password) > 20 || strlen($data->password) < 4)
{
    $message = 'Incorrect Length for Password';
}
/*** check the username has only alpha numeric characters ***/
elseif (ctype_alnum($data->username) != true)
{
    /*** if there is no match ***/
    $message = "Username must be alpha numeric";
}
/*** check the password has only alpha numeric characters ***/
elseif (ctype_alnum($data->password) != true)
{
        /*** if there is no match ***/
        $message = "Password must be alpha numeric";
}
else
{
    /*** if we are here the data is valid and we can insert it into database ***/
    $username = filter_var($data->username, FILTER_SANITIZE_STRING);
    $password = filter_var($data->password, FILTER_SANITIZE_STRING);

    /*** now we can encrypt the password ***/
    $password = sha1( $password );
    
    try
    {		
			$dbh = pdoConnect();
		
		/*** $message = a message saying we have connected ***/

        /*** set the error mode to excptions ***/
        //$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        /*** prepare the select statement ***/
        $stmt = $dbh->prepare("SELECT user_id, username, password, display_name , role FROM users 
                    WHERE username = :username AND password = :password ");

        /*** bind the parameters ***/
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR, 40);

        /*** execute the prepared statement ***/
        $stmt->execute();

        /*** check for a result ***/
		$row = $stmt->fetch();
		
        $user_id = $row['user_id'];
        $role = $row['role'];
        $display_name = $row['display_name'];
				
        /*** if we have no result then fail boat ***/
        if($user_id == false)
        {
                $message = 'Login Failed';
        }
        /*** if we do have a result, all is well ***/
        else
        {
                /*** set the session user_id variable ***/
                $_SESSION['user_id'] = $user_id;

                /*** tell the user we are logged in ***/
                $message = 'You are now logged in';
				$success = true;
        }


    }
    catch(Exception $e)
    {
        /*** if we are here, something has gone wrong with the database ***/
        $message = 'We are unable to process your request. Please try again later"';
    }
}


echo json_encode( array( "message" => $message, "success" => $success  , "display_name" => $display_name, "role" => $role ) );


?>
