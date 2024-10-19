<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

try {
    // check value is not set   
    if (!isset($_POST["code"])) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'code',
            'message' => "Field code is not set"
        ));
        exit();
    }

    // check value is empty
    if (empty(strip_tags(trim($_POST["code"])))) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'code',
            'message' => "Field code is empty"
        ));
        exit();
    }

    // verify email process
    $user = new User();
    // return response
    echo $user->verifyResetCode(DBConnector::getConnection(), $_POST["code"]);
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
