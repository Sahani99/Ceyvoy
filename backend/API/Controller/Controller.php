<?php

namespace CeyvoyApi\Controller;

use CeyvoyApi\Model\Classes\Connectors\DBConnector;
use CeyvoyApi\Model\Classes\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Controller
{
    public static function router($page): void
    {
        include_once "./API/Model/Process/$page.php";
    }

    public static function auth_router($page): void
    {
        // check if 'auth' token is set is cookie
        if (!isset($_COOKIE['auth'])) {
            http_response_code(401);
            echo json_encode(array(
                'status' => 'error',
                'message' => 'Unauthorized'
            ));
            exit();
        }

        // check if 'auth' token is valid
        $jwt = $_COOKIE['auth'];
        $decoded = JWT::decode($jwt, new Key($_ENV["JWT_SECRET"], 'HS256'));
        // decode to array
        $user = (array) $decoded;
        // get user email
        $email = $user['email'];
        // get user from database
        $users = User::isNewUser(DBConnector::getConnection(), $email);
        // get user
        $user = $users[0];
        // set user value to request
        $_POST["user"] = $user;

        include_once "./API/Model/Process/$page.php";
    }
}
