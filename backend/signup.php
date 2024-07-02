<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'DbConnect.php';

$db = new DbConnect();
$conn = $db->connect();

$data = json_decode(file_get_contents('php://input'), true);

$name = isset($data['name']) ? $data['name'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';
$user_role = isset($data['role']) ? $data['role'] : '';

if (empty($name) || empty($email) || empty($password) || empty($user_role)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$sql = "INSERT INTO users (name, email, password, user_role) VALUES (:name, :email, :password, :user_role)";
$stmt = $conn->prepare($sql);

$stmt->bindParam(':name', $name);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->bindParam(':user_role', $user_role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to register user"]);
}
?>
