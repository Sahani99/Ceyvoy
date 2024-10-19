<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

try {

    // check any value is empty
    $variable_array = array("code", "password", "confirmPassword");

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

    // password length check
    if (strlen($data_array["password"]) < 8 || strlen($data_array["password"]) > 32) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'password',
            'message' => "Password length should be between 8 to 32 characters"
        ));

        exit();
    }

    // check if password and confirm password is same
    if ($data_array["confirmPassword"] !== $data_array["password"]) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'confirmPassword',
            'message' => "Password and Confirm Password should be same"
        ));
        exit();
    }

    // reset password process
    $user = new User();
    $user->setPassword($data_array["password"]);
    $user->verifyResetCode(DBConnector::getConnection(), $data_array["code"]);
    // return response
    echo $user->resetPassword(DBConnector::getConnection());
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => "Internal Server Error"));
}
