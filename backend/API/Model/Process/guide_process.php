<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Guide;

try {
    // create guide object
    $guide = new Guide();
    // check method is get
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        http_response_code(200);
        echo $guide->getNotVerifiedGuides(DBConnector::getConnection());
        exit();
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['type']) && $_POST['type'] === 'VERIFY') {
        $guide->setUser($_POST['id']);
        http_response_code(200);
        echo $guide->approveGuide(DBConnector::getConnection());
        exit();
    }
    // check method is post
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // check any value is empty
        $variable_array = array('license', 'description', 'cost', 'contact', 'experience', 'languages');
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
            if (empty(strip_tags(trim($_POST[$variable]))) && $variable != "id") {
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

        // set values
        $guide->setLicense($data_array['license']);
        $guide->setDescription($data_array['description']);
        $guide->setCost($data_array['cost']);
        $guide->setContact($data_array['contact']);
        $guide->setExperience($data_array['experience']);
        $guide->setLanguages($data_array['languages']);
        $guide->setUser($_POST['user']['id']);

        // check type is set and its value is equal to update
        if (isset($_POST["type"]) && $_POST["type"] == "UPDATE") {
            // update guide
            http_response_code(200);
            echo $guide->updateGuide(DBConnector::getConnection());
            exit();
        } else {
            // create guide
            http_response_code(201);
            echo $guide->addGuide(DBConnector::getConnection());
            exit();
        }
    } else {
        // set response code
        http_response_code(405);
        // display message
        echo json_encode(array('status' => 'error', 'message' => 'Method not allowed'));
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
