<?php

// check method is POST

use CeyvoyApi\Model\Classes\Connectors\EmailConnector;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // check if request is POST
    if (!isset($_POST["name"]) || !isset($_POST["email"]) || !isset($_POST["subject"]) || !isset($_POST["message"])) {
        http_response_code(400);
        echo json_encode(array("error" => "Name, email, subject or message not set"));
        exit();
    } else {
        // get name , email , subject and message
        $name = $_POST["name"];
        $email = $_POST["email"];
        $subject = $_POST["subject"];
        $comment = $_POST["message"];
        // send email
        $email_template = __DIR__ . "/Templates/contact.html";
        $message = file_get_contents($email_template);
        $message = str_replace('%name%', $name, $message);
        $message = str_replace('%email%', $email, $message);
        $message = str_replace('%subject%', $subject, $message);
        $message = str_replace('%message%', $comment, $message);
        $email_connection = EmailConnector::getEmailConnection();

        $email_connection->msgHTML($message);
        $email_connection->addAddress($_ENV["CONTACT_EMAIL"], "Message from " . $name . "via contact form");
        $email_connection->addReplyTo($email, $name);
        $email_connection->Subject = $subject;
        $email_connection->send();

        http_response_code(200);
        echo json_encode(array("status" => "success", "message" => "Message sent successfully"));
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(200);
    echo json_encode(array("status" => "error", "message" => "Unauthorized access"));
}
