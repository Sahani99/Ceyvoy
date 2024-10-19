<?php

// check if request is POST

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Guide;
use CeyvoyApi\Model\Classes\User;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // create user object
    $user = new User();
    // check type is set
    if (!isset($_POST['type'])) {
        http_response_code(400);
        echo json_encode(array("error" => "Type not set"));
        exit();
    } else {
        // get type
        $type = $_POST['type'];
        // check type is setup
        if ($type == 'SYSTEM') {
            // get feedback
            $feedback = $_POST['feedback'];
            // get user id
            $user_id = $_POST['user']['id'];
            // set user id
            $user->setId($user_id);
            http_response_code(200);
            echo $user->saveSystemFeedback(DBConnector::getConnection(), $feedback);
        } else if ($type == 'GUIDE') {
            // get feedback
            $feedback = $_POST['feedback'];
            // get user id
            $user_id = $_POST['user']['id'];
            // get traveler id
            $guide_id = $_POST['guide_id'];
            // get rating
            $rating = $_POST['rating'];
            // set user id
            $user->setId($user_id);
            http_response_code(200);
            echo $user->saveGuideFeedback(DBConnector::getConnection(), $feedback, $guide_id, $rating);
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Type not setup"));
            exit();
        }
    }
} else {
    // get role
    $role = $_POST["user"]["role"];
    // create user object
    $user = new User();
    // get user id
    $user_id = $_POST["user"]["id"];
    // if role is GUIDE
    if ($role == "GUIDE") {
        // get guide details
        $guide = Guide::getGuideByUserId(DBConnector::getConnection(), $user_id);
        http_response_code(200);
        echo $user->getGuideFeedbacks(DBConnector::getConnection(), $guide["id"]);
    } else if ($role == "ADMIN") {
        http_response_code(200);
        echo $user->getSystemFeedbacks(DBConnector::getConnection());
    }
}
