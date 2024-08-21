<?php
// Include database connection file
include 'db_connect.php';

// Check if id parameter is set
if (isset($_GET['id'])) {
    $userId = intval($_GET['id']); // Ensure the id is an integer

    // Start a transaction
    $conn->begin_transaction();

    try {
        // First, delete the related tour guides
        $sqlDeleteTourguides = "DELETE FROM tourguides WHERE user_id = ?";
        if ($stmt = $conn->prepare($sqlDeleteTourguides)) {
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $stmt->close();
        } else {
            throw new Exception("Could not prepare tour guide deletion query: " . $conn->error);
        }

        // Then, delete the user
        $sqlDeleteUser = "DELETE FROM users WHERE user_id = ?";
        if ($stmt = $conn->prepare($sqlDeleteUser)) {
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $stmt->close();
        } else {
            throw new Exception("Could not prepare user deletion query: " . $conn->error);
        }

        // Commit the transaction
        $conn->commit();

        // Redirect to another page after successful deletion
        header("Location: tourguides_table.php?msg=Tourguide deleted successfully");
        exit();

    } catch (Exception $e) {
        // Rollback the transaction if something failed
        $conn->rollback();

        // Handle the error
        echo "Error: " . $e->getMessage();
    }

    // Close the database connection
    $conn->close();
} else {
    // If no ID is provided, redirect or show an error
    header("Location: tourguides_table.php?msg=Invalid tourguide ID");
    exit();
}
?>