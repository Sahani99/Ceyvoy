<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

try {
    // check any value is empty
    $variable_array = array("email", "password");

    // check any value is not set
    foreach ($variable_array as $variable) {
        if (!isset($_POST[$variable])) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => $variable,
                'message' => "Field $variable is not set"
            ));
            exit();
        }
    }

    // check if any value is empty
    $data_array = array();
    foreach ($variable_array as $variable) {
        if (empty(strip_tags(trim($_POST[$variable])))) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => $variable,
                'message' => "Field $variable is empty"
            ));
            exit();
        }
        // assign value to array
        $data_array[$variable] = strip_tags(trim($_POST[$variable]));
    }

    // validate email
    if (!filter_var($data_array["email"], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'email',
            'message' => "Invalid Email"
        ));
        exit();
    }

    // login process
    $user = new User();
    $user->setEmail($data_array["email"]);
    $user->setPassword($data_array["password"]);
    // return response
    echo $user->login(DBConnector::getConnection());
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => "Internal Server Error"));
}
