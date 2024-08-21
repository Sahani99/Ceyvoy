<?php
session_start();

include 'db_connect.php';

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $user_id = intval($_POST['user_id']); // Ensure the user ID is an integer
    $name = $_POST['name'];
    $email = $_POST['email'];

    // Prepare the SQL insert statement
    $sql = "INSERT INTO accomadations (user_id, name, email) VALUES (?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        // Bind parameters
        $stmt->bind_param("iss", $user_id, $name, $email);

        // Execute the statement
        if ($stmt->execute()) {
            // Redirect to the accommodations table page with a success message
            header("Location: accommodations_table.php?msg=Accommodation added successfully");
            exit();
        } else {
            // Handle SQL execution error
            echo "Error: Could not execute query: " . $stmt->error;
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        // Handle SQL preparation error
        echo "Error: Could not prepare query: " . $conn->error;
    }

    // Close the database connection
    $conn->close();
} else {
    // Redirect to the form if the request method is not POST
    header("Location: add_accommodation.php");
    exit();
}
?>
