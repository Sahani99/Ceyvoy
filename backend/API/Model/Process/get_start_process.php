<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Locations;
use CeyvoyApi\Model\Classes\Trip;

if (isset($_POST["step"]) && $_POST["step"] == 1) {
    // check if environment is set
    if (!isset($_POST["environment"])) {
        http_response_code(400);
        echo json_encode(array("error" => "Environment not set"));
        exit();
    } else {
        $environment = $_POST["environment"];
        // convert environment to array
        $environment = explode(",", $environment);
        // create location object
        $location = new Locations();
        // get locations and return
        http_response_code(200);
        echo $location->getLocationsByCategories(DBConnector::getConnection(), $environment);
    }
} else if (isset($_POST["step"]) && $_POST["step"] == 2) {
    // check if location is set
    if (!isset($_POST["locations"])) {
        http_response_code(400);
        echo json_encode(array("error" => "Location not set"));
        exit();
    } else {
        // create system object
        $system = new Trip();
        // get location details
        $locations = $_POST["locations"];
        // convert locations to array
        $locations = explode(",", $locations);
        // get start date
        $start_date = $_POST["start_date"];
        // get end date
        $end_date = $_POST["end_date"];
        //get language
        $language = $_POST["language"];
        // create location object
        $location = new Locations();
        // get accommodations 
        $accommodations = $system->getAccommodationsByLocations(DBConnector::getConnection(), $locations);
        // get guides
        $guides = $system->getGuidesByDateRange(DBConnector::getConnection(), $start_date, $end_date, $language);
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "accommodations" => $accommodations,
            "guides" => $guides
        ));
    }
} else if (isset($_POST["step"]) && $_POST["step"] == 3) {
    // check if accommodation is set
    if (!isset($_POST["accommodations"]) || !isset($_POST["guide"])) {
        http_response_code(400);
        echo json_encode(array("error" => "Accommodation not set"));
        exit();
    } else {
        // create system object
        $system = new Trip();
        // get language details
        $language = $_POST["language"];
        // get people details
        $people = $_POST["people"];
        // get budget details
        $budget = $_POST["budget"];
        // get accommodation details and convert to array
        $accommodations = explode(",", $_POST["accommodations"]);
        // get accommodation price details and convert to array
        $accommodation_prices = explode(",", $_POST["accommodation_prices"]);
        // get guide details
        $guide = $_POST["guide"];
        // get environment details
        $environment = $_POST["environment"];
        // get start date
        $start_date = $_POST["start_date"];
        // get end date
        $end_date = $_POST["end_date"];
        // get location details and convert to array
        $locations = explode(",", $_POST["locations"]);
        // save data to system object
        $system->setDateFrom($start_date)
            ->setDateTo($end_date)
            ->setLocations($locations)
            ->setEnvironment($environment)
            ->setAccommodations($accommodations)
            ->setAccommodationPrices($accommodation_prices)
            ->setGuide($guide)
            ->setBudget($budget)
            ->setPeople($people)
            ->setLanguage($language)
            ->setUser($_POST["user"]["id"]);

        http_response_code(200);
        echo $system->saveTravel(DBConnector::getConnection());
    }
} else {
    http_response_code(400);
    echo json_encode(array("error" => "Step not set"));
    exit();
}
