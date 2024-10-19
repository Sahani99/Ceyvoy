<?php

// get role

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Guide;
use CeyvoyApi\Model\Classes\Trip;

$role = $_POST["user"]["role"];
// create trip object
$trip = new Trip();
// if request is not POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // check id and status is setup
    if (!isset($_POST["id"]) || !isset($_POST["status"])) {
        http_response_code(400);
        echo json_encode(array("error" => "ID or status not set"));
        exit();
    } else {
        // get id
        $id = $_POST["id"];
        // get status
        $status = $_POST["status"];
        http_response_code(200);
        // update status
        echo $trip->updateTravelStatus(DBConnector::getConnection(), $id, $status);
    }
    // if request is GET
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // if role is TRAVELER
    if ($role == "TRAVELER") {
        http_response_code(200);
        echo $trip->getTravelerTravels(DBConnector::getConnection(), $_POST["user"]["id"]);
    } else if ($role == "GUIDE") {
        http_response_code(200);
        $guide = Guide::getGuideByUserId(DBConnector::getConnection(), $_POST["user"]["id"]);
        echo $trip->getGuideTravels(DBConnector::getConnection(), $guide["id"]);
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Unauthorized access"));
        exit();
    }
}
