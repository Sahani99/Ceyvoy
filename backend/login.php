<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'DbConnect.php';

$db = new DbConnect();
$conn = $db->connect();

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT * FROM users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && $password === $user['password']) {
    echo json_encode(["status" => "success", "message" => "Login successful", "user" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
}
?>
