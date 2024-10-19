<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\Guide;
use CeyvoyApi\Model\Classes\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

try {
    // check if 'auth' token is set is cookie
    if (!isset($_COOKIE['auth'])) {
        http_response_code(200);
        echo json_encode(array(
            'status' => 401,
            'message' => 'Unauthorized'
        ));
        exit();
    }

    // check if 'auth' token is valid
    $jwt = $_COOKIE['auth'];
    $decoded = JWT::decode($jwt, new Key($_ENV["JWT_SECRET"], 'HS256'));
    $user = (array) $decoded;
    // get user email
    $email = $user['email'];
    // get user from database
    $users = User::isNewUser(DBConnector::getConnection(), $email);
    // get user
    $user = $users[0];
    $guide = null;

    // if role is guide then get guide
    if ($user['role'] == 'GUIDE') {
        $guide = Guide::getGuideByUserId(DBConnector::getConnection(), $user['id']);
    }

    // return response
    http_response_code(200);
    echo json_encode(array(
        'status' => 200,
        'message' => 'Authorized',
        'user' => array(
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
            'profileImage' => $user['profile_image'],
            'guide' => $guide
        )
    ));
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(array('status' => 'error', 'message' => "Internal Server Error"));
}
