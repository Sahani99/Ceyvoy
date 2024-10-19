<?php

use CeyvoyApi\Model\Classes\User;


try {
    // logout process
    $user = new User();
    echo $user->logout();
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => "Internal Server Error"));
}
