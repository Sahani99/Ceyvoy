<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (adjust for production)
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers (adjust for production)
header("Access-Control-Allow-Methods: POST"); // Allow POST method for data submission

$dsn = 'mysql:host=localhost;dbname=ceyvoy_traveldb';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true); // Decode JSON as associative array

    // Validate required fields
    $requiredFields = ['triptype', 'NoofMembers', 'startDate', 'stayingnights', 'budget', 'languages', 'environments'];
    $missingFields = [];

    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $missingFields[] = $field;
        }
    }

    if (!empty($missingFields)) {
        $message = "Missing fields: " . implode(', ', $missingFields);
        echo json_encode(["status" => 0, "message" => $message]);
        exit;
    }

    // Prepare SQL statement using named placeholders
    $sql = "INSERT INTO trips (trip_type, NoofMembers, arrive_date, staying_nights, budget, languages, environments) 
            VALUES (:trip_type, :NoofMembers, :arrive_date, :staying_nights, :budget, :languages, :environments)";
    $stmt = $pdo->prepare($sql);

    // Bind parameters using prepared statement
    $stmt->bindParam(':trip_type', $data['triptype']);
    $stmt->bindParam(':NoofMembers', $data['NoofMembers']);
    $stmt->bindParam(':arrive_date', $data['startDate']); // Assuming arrivaldate is in a format compatible with the database date type
    $stmt->bindParam(':staying_nights', $data['stayingnights']);
    $stmt->bindParam(':budget', $data['budget']);
    $stmt->bindParam(':languages', $data['languages']); // Assuming languages is a string or a single language

    // Join environments array to a comma-separated string
    $environments = implode(',', $data['environments']);
    $stmt->bindParam(':environments', $environments);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["status" => 1, "message" => "Data inserted successfully"]);
    } else {
        echo json_encode(["status" => 0, "message" => "Failed to insert data"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => 0, "message" => $e->getMessage()]);
}
?>
