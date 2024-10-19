<?php
// for remove request blocking
header("Access-Control-Allow-Origin: http://localhost:3000");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers:Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');

// start session
session_set_cookie_params(['SameSite' => 'None', 'Secure' => true]);

use Bramus\Router\Router;
use Dotenv\Dotenv;
use CeyvoyApi\Controller\Controller;

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
$app = new Router();

$app->setNamespace('\CeyvoyApi');
$app->setBasePath('/');

// Handle OPTIONS
$app->options('/.*', function () {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    http_response_code(200);
    exit();
});

$app->get("/", function () {
    header("Location: http://localhost:3000/");
});
$app->post("/sign_up", function () {
    Controller::router("sign_up_process");
});
$app->post("/login", function () {
    Controller::router("login_process");
});
$app->post("/resend_verification", function () {
    Controller::router("resend_verification_process");
});
$app->post("/verify_email", function () {
    Controller::router("verify_email_process");
});
$app->post("/forgot_password", function () {
    Controller::router("forgot_password_process");
});
$app->post("/verify_reset_password", function () {
    Controller::router("verify_reset_password_process");
});
$app->post("/reset_password", function () {
    Controller::router("reset_password_process");
});
$app->post("/logout", function () {
    Controller::router("logout_process");
});
$app->get("/authorize", function () {
    Controller::router("authorize_process");
});
$app->post("/update_account", function () {
    Controller::auth_router("update_account_process");
});
$app->post("/location", function () {
    Controller::auth_router("location_process");
});
$app->get("/location", function () {
    Controller::router("location_process");
});
$app->get("/location/my", function () {
    Controller::auth_router("location_process");
});
$app->post("/event", function () {
    Controller::auth_router("event_process");
});
$app->get("/event", function () {
    Controller::router("event_process");
});
$app->post("/accommodation", function () {
    Controller::auth_router("accommodation_process");
});
$app->get("/accommodation", function () {
    Controller::auth_router("accommodation_process");
});
$app->post("/guide", function () {
    Controller::auth_router("guide_process");
});
$app->get("/guide", function () {
    Controller::auth_router("guide_process");
});
$app->post("/get_start", function () {
    Controller::router("get_start_process");
});
$app->post("/get_start/finish", function () {
    Controller::auth_router("get_start_process");
});
$app->get("/travels", function () {
    Controller::auth_router("travels_process");
});
$app->post("/travels", function () {
    Controller::auth_router("travels_process");
});
$app->post("/feedbacks", function () {
    Controller::auth_router("feedbacks_process");
});
$app->get("/feedbacks", function () {
    Controller::auth_router("feedbacks_process");
});
$app->post("/accounts", function () {
    Controller::auth_router("accounts_process");
});
$app->get("/accounts", function () {
    Controller::auth_router("accounts_process");
});
$app->get("/statistics", function () {
    Controller::auth_router("statistics_process");
});
$app->post("/contact", function () {
    Controller::router("contact_process");
});

$app->run();
