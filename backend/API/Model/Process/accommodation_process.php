<?php

use CeyvoyApi\Model\Classes\Accommodations;
use CeyvoyApi\Model\Classes\Connectors\DBConnector;

try {
    // create accommodation object
    $accommodation = new Accommodations();
    // check method is get
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        // set user id
        $accommodation->setUser($_POST["user"]["id"]);
        // check search value is set
        if (isset($_GET["search"])) {
            // get all accommodations by search
            echo $accommodations = $accommodation->searchAccommodation(DBConnector::getConnection(), $_GET["search"]);
            exit();
        }
        // get all accommodations by status
        echo $accommodations = $accommodation->fetchByUser(DBConnector::getConnection());
        exit();
    }
    // check method is post and type is update
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["type"]) && $_POST["type"] == "UPDATE") {
        // check any value is empty
        $variable_array = array("id", "name" , "address", "category", "city", "website", "maxGuests", "description", "contactNo", "facilities" , "price");
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
            $accommodation->setImage($_POST["image"]);
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
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/accommodations/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/accommodations/" . $new_img_name;
                        // set image
                        $accommodation->setImage($image);
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
        $accommodation->setId($data_array["id"]);
        // set name
        $accommodation->setName($data_array["name"]);
        // set address
        $accommodation->setAddress($data_array["address"]);
        // set category
        $accommodation->setCategory($data_array["category"]);
        // set city
        $accommodation->setCity($data_array["city"]);
        // set website
        $accommodation->setWebsite($data_array["website"]);
        // set max guests
        $accommodation->setMaxGuests($data_array["maxGuests"]);
        // set description
        $accommodation->setDescription($data_array["description"]);
        // set contact no
        $accommodation->setContactNo($data_array["contactNo"]);
        // set facilities
        $accommodation->setFacilities($data_array["facilities"]);
        // set price
        $accommodation->setPrice($data_array["price"]);
        // update accommodation
        echo $accommodation->updateAccommodation(DBConnector::getConnection());
        exit();
    }
    // check method is post
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // check any value is empty
        $variable_array = array("name" , "address", "category", "city", "website", "maxGuests", "description", "contactNo", "facilities" , "price");
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
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/accommodations/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/accommodations/" . $new_img_name;

                        // set image
                        $accommodation->setImage($image);
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

        // set name
        $accommodation->setName($data_array["name"]);
        // set address
        $accommodation->setAddress($data_array["address"]);
        // set category
        $accommodation->setCategory($data_array["category"]);
        // set city
        $accommodation->setCity($data_array["city"]);
        // set website
        $accommodation->setWebsite($data_array["website"]);
        // set max guests
        $accommodation->setMaxGuests($data_array["maxGuests"]);
        // set description
        $accommodation->setDescription($data_array["description"]);
        // set contact no
        $accommodation->setContactNo($data_array["contactNo"]);
        // set facilities
        $accommodation->setFacilities($data_array["facilities"]);
        // set user
        $accommodation->setUser($_POST["user"]["id"]);
        // set price
        $accommodation->setPrice($data_array["price"]);
        // add accommodation
        echo $accommodation->addAccommodation(DBConnector::getConnection());
        exit();
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
