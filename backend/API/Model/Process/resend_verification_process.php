<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

try {
    // check value is not set
    if (!isset($_POST["email"])) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'email',
            'message' => "Field email is not set"
        ));
        exit();
    }

    // check value is empty
    if (empty(strip_tags(trim($_POST["email"])))) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'email',
            'message' => "Field email is empty"
        ));
        exit();
    }

    // validate email
    if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'email',
            'message' => "Invalid Email"
        ));
        exit();
    }

    // resend verification process
    $user = new User();
    $user->setEmail(strip_tags(trim($_POST["email"])));
    // return response
    echo $user->resendVerification(DBConnector::getConnection());
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
