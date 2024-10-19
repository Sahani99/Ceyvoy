<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Events;

try {
    // create event object
    $event = new Events();
    // check users role using request 'user' header
    $role = null;
    if (isset($_POST["user"]["role"])) {
        $role = $_POST["user"]["role"];
    }
    // check method is get
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        // if search query is set
        if (isset($_GET["search"])) {
            // get all events by status and search query
            http_response_code(200);
            echo $events = $event->getEventsBySearch(DBConnector::getConnection(), $_GET["search"]);
            exit();
        }

        // get all events by status
        echo $events = $event->getEvents(DBConnector::getConnection());
        exit();
    }
    // check method is put
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["type"]) && $_POST["type"] == "UPDATE" && $role == "ADMIN") {
        // check any value is empty
        $variable_array = array("id", "title", "description", "city", "province", "category", "start", "end");
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
            $event->setImage($_POST["image"]);
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
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/events/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/events/" . $new_img_name;
                        // set image
                        $event->setImage($image);
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
        $event->setId($data_array["id"]);
        // set title
        $event->setTitle($data_array["title"]);
        // set description
        $event->setDescription($data_array["description"]);
        // set city
        $event->setCity($data_array["city"]);
        // set province
        $event->setProvince($data_array["province"]);
        // set category
        $event->setCategory($data_array["category"]);
        // set start
        $event->setStart($data_array["start"]);
        // set end
        $event->setEnd($data_array["end"]);
        // set updated by
        $event->setUpdatedBy($_POST["user"]["id"]);
        // update event
        echo $event->updateEvent(DBConnector::getConnection());
        exit();
    }
    // check method is post
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // check any value is empty
        $variable_array = array("title", "description", "city", "province", "category", "start", "end");
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
                        $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/events/" . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);
                        $image = "uploads/events/" . $new_img_name;

                        // set image
                        $event->setImage($image);
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
        $event->setTitle($data_array["title"]);
        // set description
        $event->setDescription($data_array["description"]);
        // set city
        $event->setCity($data_array["city"]);
        // set province
        $event->setProvince($data_array["province"]);
        // set category
        $event->setCategory($data_array["category"]);
        // set start
        $event->setStart($data_array["start"]);
        // set end
        $event->setEnd($data_array["end"]);
        // set status
        $event->setStatus($role == "ADMIN" ? "APPROVED" : "PENDING");
        // set created by
        $event->setCreatedBy($_POST["user"]["id"]);
        // set updated by
        $event->setUpdatedBy($_POST["user"]["id"]);
        // save event
        echo $event->addEvent(DBConnector::getConnection());
        exit();
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => $ex->getMessage()));
}
