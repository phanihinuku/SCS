<?php 
require "Services/Twilio.php";

// Send SMS
// - $fromNumber is your Twilio number
// - $toNumber is any phone number
// - $message is the sms body
// this line loads the library 
//require('/path/to/twilio-php/Services/Twilio.php'); 
 
$account_sid = 'AC8146d622eccaf32eb123d59bb8fc071e'; 
$auth_token = '6c3486c7995c9f10ee3e3f659ce63b3d'; 
$client = new Services_Twilio($account_sid, $auth_token); 
 try {
/*$client->account->messages->create(array( 
	'To' => "+919916200346", 
	'From' => "+12513335687", 
	'Body' => "hi test message",   
));*/

 $sms = $client->account->messages->sendMessage("+12513335687", "+919980023936", "hi test message");

    // Display a confirmation message on the screen
    echo "An SMS message was sent to $toNumber";
}catch (Exception $e) {
    echo "The message was not sent!<br><br>";
    // If you don't see the previous message
    // Check to see if your Twilio phone number is correct in the $fromNumber
    // Check to see if the number you are texting is verified (the $toNumber)
    // The $toNumber must be verified if you are using a trial Twilio account

    echo "From Number: " . $fromNumber." (must be your Twilio phone number)<br>";
    echo "To Number: " . $toNumber." (this must be a verified phone number if you are using a trial account)<br>";
    echo "Message: " . $message."<br>";
    echo "<br>";
}

?>