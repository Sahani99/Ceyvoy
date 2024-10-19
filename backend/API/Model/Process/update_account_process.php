<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;

try {
    // check type value is not set
    if (!isset($_POST["type"])) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'type',
            'message' => "Field type is not set"
        ));
        exit();
    }

    // check type value is empty
    if (empty(strip_tags(trim($_POST["type"])))) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'type',
            'message' => "Field type is empty"
        ));
        exit();
    }
    // validate type (allows only 'name','email','password','profileImage')
    if (!in_array($_POST["type"], array('name', 'email', 'password', 'profileImage'))) {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'property' => 'type',
            'message' => "Invalid Type"
        ));
        exit();
    }

    // create user object
    $user = new User();
    // set user id
    $user->setId($_POST["user"]["id"]);
    //set user email
    $user->setEmail($_POST["user"]["email"]);

    // if type is name
    if ($_POST["type"] == "name") {
        // check name value is not set
        if (!isset($_POST["name"])) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'name',
                'message' => "Field name is not set"
            ));
            exit();
        }

        // save name value
        $name = strip_tags(trim($_POST["name"]));

        // check name value is empty
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'name',
                'message' => "Field name is empty"
            ));
            exit();
        }

        // set name
        $user->setName($name);
        // return response
        echo $user->updateName(DBConnector::getConnection());
        exit();
    }
    // if type is email 
    else if ($_POST["type"] == "email") {
        // check email value is not set
        if (!isset($_POST["email"])) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'email',
                'message' => "Field email is not set"
            ));
            exit();
        }

        // save email value
        $email = strip_tags(trim($_POST["email"]));

        // check email value is empty
        if (empty($email)) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'email',
                'message' => "Field email is empty"
            ));
            exit();
        }

        // validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'email',
                'message' => "Invalid Email"
            ));
            exit();
        }

        // set email
        $user->setEmail($email);
        // return response
        echo $user->updateEmail(DBConnector::getConnection());
        exit();
    }
    // if type is password
    else if ($_POST["type"] == "password") {
        // check any value is empty
        $variable_array = array("password", "confirmPassword", "currentPassword");

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

        // check password length
        if (strlen($data_array["password"]) < 8 || strlen($data_array["password"]) > 32) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'password',
                'message' => "Password must be between 8 to 32 characters"
            ));
            exit();
        }

        // check password and confirm password
        if ($data_array["password"] != $data_array["confirmPassword"]) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'confirmPassword',
                'message' => "Password and Confirm Password must be same"
            ));
            exit();
        }

        // check current password and new password
        if ($data_array["password"] == $data_array["currentPassword"]) {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'password',
                'message' => "New Password and Current Password must be different"
            ));
            exit();
        }

        // validate password
        $results = User::isNewUser(DBConnector::getConnection(), $user->getEmail());
        if (password_verify($data_array["currentPassword"], $results[0]["password"])) {
            // set password
            $user->setPassword($data_array["password"]);
            echo $user->updatePassword(DBConnector::getConnection());
            exit();
        } else {
            http_response_code(400);
            echo json_encode(array(
                'status' => 'error',
                'property' => 'currentPassword',
                'message' => "Current Password is incorrect"
            ));
            exit();
        }
    }
    // if type is avatar
    else if ($_POST["type"] == "profileImage" && isset($_FILES['profileImage'])) {
        $img_name = $_FILES['profileImage']['name'];
        $img_size = $_FILES['profileImage']['size'];
        $tmp_name = $_FILES['profileImage']['tmp_name'];
        $error = $_FILES['profileImage']['error'];

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
                    $new_img_name = strtolower($_POST["user"]["email"]) . '.' . $img_ex_lc;
                    $img_upload_path = $_SERVER['DOCUMENT_ROOT'] . "/uploads/avatars/" . $new_img_name;
                    move_uploaded_file($tmp_name, $img_upload_path);
                    $avatar = "uploads/avatars/" . $new_img_name;

                    // update avatar
                    echo $user->updateAvatar(DBConnector::getConnection(), $avatar);
                    exit();
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
    // if type is invalid
    else {
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'message' => "Invalid Type"
        ));
        exit();
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => "Internal Server Error"));
}
