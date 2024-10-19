<?php

// get role

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

$role = $_POST["user"]["role"];
// check role is ADMIN
if ($role == "ADMIN") {
    // create user object
    $user = new User();
    // check if request is POST
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // check if id and status is setup
        if (!isset($_POST["id"]) || !isset($_POST["status"])) {
            http_response_code(400);
            echo json_encode(array("error" => "ID or status not set"));
            exit();
        } else {
            // get id
            $id = $_POST["id"];
            // get status
            $status = $_POST["status"];
            // set user id
            $user->setId($id);
            // set status
            if ($status == 'ACTIVATE') {
                $user->setIsActive(1);
            } else {
                $user->setIsActive(0);
            }
            http_response_code(200);
            // update status
            echo $user->updateUserStatus(DBConnector::getConnection());
        }
    } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        http_response_code(200);
        echo $user->getUserDetails(DBConnector::getConnection());
    }
} else {
    http_response_code(400);
    echo json_encode(array("error" => "Unauthorized access"));
    exit();
}
