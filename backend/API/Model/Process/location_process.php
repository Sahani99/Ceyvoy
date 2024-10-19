<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Locations;

try {
    // create location object
    $location = new Locations();
    // check users role using request 'user' header
    $role = null;
    if (isset($_POST["user"]["role"])) {
        $role = $_POST["user"]["role"];
    }
    // check method is get
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        // if user is guide , get all locations by guide id
        if ($role == "GUIDE") {
            // set guide id
            $location->setCreatedBy($_POST["user"]["id"]);
            // if search query is set
            if (isset($_GET["search"])) {
                // get all locations by guide id and search query
                http_response_code(200);
                echo $locations = $location->getLocationsByCreatedByWithSearch(DBConnector::getConnection(), $_GET["search"]);
                exit();
            }
            // get all locations by guide id
            http_response_code(200);
            echo $locations = $location->getLocationsByCreatedBy(DBConnector::getConnection());
            exit();
        }

        if (
            isset($_GET["status"]) &&
            $_GET["status"] == "PENDING"
        ) {
            // set status
            $location->setStatus("PENDING");
        } else if (
            isset($_GET["status"]) &&
            $_GET["status"] == "REJECTED"
        ) {
            // set status
            $location->setStatus("REJECTED");
        } else {
            // set status
            $location->setStatus("APPROVED");
        }

        // if search query is set
        if (isset($_GET["search"])) {
            // get all locations by status and search query
            http_response_code(200);
            echo $locations = $location->getLocationsByStatusWithSearch(DBConnector::getConnection(), $_GET["search"]);
            exit();
        }

        // get all locations by status
        echo $locations = $location->getLocationsByStatus(DBConnector::getConnection());
        exit();
    }
    // check method is put
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["type"]) && $_POST["type"] == "UPDATE" && $role == "ADMIN") {
        // check any value is empty
        $variable_array = array("id", "title", "description", "city", "province", "category", "lat", "long");
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

        // validate image
        if (!isset($_FILES["image"])) {
            // check if image value is not set
            if (!isset($_POST["image"])) {
                http_response_code(400);
                echo json_encode(array(
                    'status' => 'error',
                    'property' => 'image',
                    'message' => "Field image is not set"
                ));
                exit();
            }

            // check if image value is empty
            if (empty($_POST["image"])) {
                http_response_code(400);
                echo json_encode(array(
                    'status' => 'error',
                    'property' => 'image',
                    'message' => "Field image is empty"
                ));
                exit();
            }

            // set image
            $location->setImage($_POST["image"]);
        } else {
            $img_name = $_FILES['image']['name'];
            $img_size = $_FILES['image']['size'];
            $tmp_name = $_FILES['image']['tmp_name'];
            $error = $_FILES['image']['error'];

            if ($error === 0) {
                if (
                    $img_size > 2 * 1024 * 1024
                ) {
                    http_response_code(400);
                    echo json_encode(array(
                        'status' => 400,
                        'message' => "Please Upload 2MB or Lower Size Image"
                    ));
                    exit();
                } else {
                    $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
                    $img_ex_lc = strtolower($img_ex);
                    $allowed_exs = array("jpg", "jpeg", "png");

                    if (in_array($img_ex_lc, $allowed_exs)) {
                        $new_img_name = uniqid("IMG-", true) . '.' . $img_ex_lc;
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/locations/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/locations/" . $new_img_name;
                        // set image
                        $location->setImage($image);
                    } else {
                        http_response_code(400);
                        echo json_encode(
                            array(
                                'status' => 400,
                                'message' => "File Format Not Support."
                            )
                        );
                        exit();
                    }
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    'status' => 400,
                    'message' => "Please upload a file"
                ));
                exit();
            }
        }

        // set id
        $location->setId($data_array["id"]);
        // set title
        $location->setTitle($data_array["title"]);
        // set description
        $location->setDescription($data_array["description"]);
        // set city
        $location->setCity($data_array["city"]);
        // set province
        $location->setProvince($data_array["province"]);
        // set category
        $location->setCategory($data_array["category"]);
        // set lat
        $location->setLatitude($data_array["lat"]);
        // set long
        $location->setLongitude($data_array["long"]);
        // set updated by
        $location->setUpdatedBy($_POST["user"]["id"]);
        // update location
        echo $location->updateLocation(DBConnector::getConnection());
        exit();
    }
    // approve or reject location
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["type"]) && $_POST["type"] == "APPROVE" && $role == "ADMIN") {
        // get location by id
        $location->setId($_POST["id"]);
        // set status
        $location->setStatus($_POST["status"]);
        // set updated by
        $location->setUpdatedBy($_POST["user"]["id"]);
        // update location
        http_response_code(200);
        echo $location->approveOrRejectLocation(DBConnector::getConnection());
        exit();
    }
    // check method is post
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // check any value is empty
        $variable_array = array("title", "description", "city", "province", "category", "lat", "long");
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

        // validate image
        if (!isset($_FILES["image"])) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'image',
                'message' => "Field image is not set"
            ));
            exit();
        } else {
            $img_name = $_FILES['image']['name'];
            $img_size = $_FILES['image']['size'];
            $tmp_name = $_FILES['image']['tmp_name'];
            $error = $_FILES['image']['error'];

            if ($error === 0) {
                if (
                    $img_size > 2 * 1024 * 1024
                ) {
                    http_response_code(400);
                    echo json_encode(array(
                        'status' => 400,
                        'message' => "Please Upload 2MB or Lower Size Image"
                    ));
                    exit();
                } else {
                    $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
                    $img_ex_lc = strtolower($img_ex);
                    $allowed_exs = array("jpg", "jpeg", "png");

                    if (in_array($img_ex_lc, $allowed_exs)) {
                        $new_img_name = uniqid("IMG-", true) . '.' . $img_ex_lc;
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/locations/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/locations/" . $new_img_name;

                        // set image
                        $location->setImage($image);
                    } else {
                        http_response_code(400);
                        echo json_encode(
                            array(
                                'status' => 400,
                                'message' => "File Format Not Support."
                            )
                        );
                        exit();
                    }
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    'status' => 400,
                    'message' => "Please upload a file"
                ));
                exit();
            }
        }


        // set title
        $location->setTitle($data_array["title"]);
        // set description
        $location->setDescription($data_array["description"]);
        // set city
        $location->setCity($data_array["city"]);
        // set province
        $location->setProvince($data_array["province"]);
        // set category
        $location->setCategory($data_array["category"]);
        // set lat
        $location->setLatitude($data_array["lat"]);
        // set long
        $location->setLongitude($data_array["long"]);
        // set status
        $location->setStatus($role == "ADMIN" ? "APPROVED" : "PENDING");
        // set created by
        $location->setCreatedBy($_POST["user"]["id"]);
        // set updated by
        $location->setUpdatedBy($_POST["user"]["id"]);
        // save location
        echo $location->addLocation(DBConnector::getConnection());
        exit();
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
