<?php

require_once("db-settings.php"); //Require DB connection

/*** begin our session ***/
session_start();


$data = json_decode( $_POST['data'] );
$success = false;

/*** first check that both the username, password and form token have been sent ***/
if(  !check_if_admin_loggedin( ) )
{
	$message = 'Current user does not have Admin privileges';
}
elseif(!isset( $data->username, $data->password ))
{
    $message = 'Please enter a valid username and password';
}
/*** check the form token is valid ***/
//elseif( $_POST['form_token'] != $_SESSION['form_token'])
//{
//    $message = 'Invalid form submission';
//}
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

        /*** prepare the insert ***/
        $stmt = $dbh->prepare("INSERT INTO users (username, password , display_name , role) VALUES (:username, :password , :display_name , :role)");

        /*** bind the parameters ***/
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR, 40);
		
        $stmt->bindParam(':display_name', $data->display_name , PDO::PARAM_STR);
		
        $stmt->bindParam(':role', $data->role , PDO::PARAM_STR);

        /*** execute the prepared statement ***/
        $stmt->execute();

        /*** unset the form token session variable ***/
        //unset( $_SESSION['form_token'] );

        /*** if all is done, say thanks ***/
        $message = 'New user added successfully';
		
		$success = true;
    }
    catch(Exception $e)
    {
        /*** check if the username already exists ***/
        if( $e->getCode() == 23000)
        {
            $message = 'Username already exists';
        }
        else
        {
			echo "".$e->getMessage();
            /*** if we are here, something has gone wrong with the database ***/
            $message = 'We are unable to process your request. Please try again later"';
        }
    }
}


echo json_encode( array( "message" => $message , "success" => $success ) );


function check_if_admin_loggedin( ) //Check if current user logged in is an admin
{
	if(!isset( $_SESSION['user_id'] )) return false; //No user, no admin

	$dbh = pdoConnect();
	
	//echo json_encode( $_SESSION['user_id'] );
	
	$stmt = $dbh->prepare("SELECT role FROM users WHERE user_id = :user_id");
	
	$stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_STR);
	$stmt->execute();
	$row = $stmt->fetch();
        
	if($row['role'] == "A") return true;
	else return false;
	
}

?>
