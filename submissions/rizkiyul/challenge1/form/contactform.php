<?php
if(isset($_POST['email']) && !empty($_POST['email'])){

		$name = $_POST["name"];
		$email = $_POST["email"];
		$phone = $_POST["phone"];
		$subject = $_POST["subject"];
		$message = $_POST["message"];
		$timestamp_capture = time();

		if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'){
	    	$siteurl = "https://".$_SERVER['SERVER_NAME'];
	    }else{
	    	$siteurl = "http://".$_SERVER['SERVER_NAME'];
	    }

	
		$to = "test@layoutflow.com";
		$mail_subject = "Contact Query From $name | Message ID ".$timestamp_capture;
		$mail_message = "
		<br>
		<p>You received a query from your website. The details are as below:</p>
		<br>
		<p><strong>Name:</strong> $name</p> 
		<p><strong>Email:</strong> $email</p> 
		<p><strong>Phone:</strong> $phone</p> 
		<p><strong>Subject:</strong> $subject</p> 
		<p><strong>Message</strong></p>
		<p>
		$message
		</p>
		<br><br><br>...<br>
		This message is sent from $siteurl using a contact form.
		";
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		// More headers
		$headers .= 'From: '.$name.' <noreply@'.$_SERVER['SERVER_NAME'].'>' . "\r\n" . 'Reply-To: '.$email."\r\n";
		$sendmail = mail($to,$mail_subject,$mail_message,$headers);

		if($sendmail){
			$response['status'] = 'Ok';
			$response['msg'] = 'Message Sent Successfully.';
			echo json_encode($response);
		}else{
			$response['status'] = 'Error';
			$response['msg'] = 'Something Went Wrong (Error 1). Please Send Us an Email!';
			echo json_encode($response);
		}
			

}else{
	$response['status'] = 'Error';
	$response['msg'] = 'Something Went Wrong (Error 2). Please Send Us an Email!';
	echo json_encode($response);
}
?>