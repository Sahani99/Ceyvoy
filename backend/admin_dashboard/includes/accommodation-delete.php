<?php
include 'db_connect.php';

// Check if id parameter is set
if (isset($_GET['id'])) {
    $userId = intval($_GET['id']); // Ensure the id is an integer
    
    // Start a transaction
    $conn->begin_transaction();

    try {
        // First delete from the accomadations table
        $delete_accommodation_query = $conn->prepare("DELETE FROM accommodations WHERE user_id = ?");
        $delete_accommodation_query->bind_param("i", $userId);
        $delete_accommodation_query->execute();
        $delete_accommodation_query->close();

        // Then delete from the users table
        $delete_user_query = $conn->prepare("DELETE FROM users WHERE user_id = ?");
        $delete_user_query->bind_param("i", $userId);
        $delete_user_query->execute();
        $delete_user_query->close();

        // Commit the transaction
        $conn->commit();

        // Redirect after successful deletion
        header("Location: accommodations_table.php?msg=Accommodation deleted successfully");
        exit();
        
    } catch (mysqli_sql_exception $exception) {
        $conn->rollback(); // Rollback the transaction on error
        echo "Error deleting record: " . $exception->getMessage();
    }

    // Close the database connection
    $conn->close();
} else {
    // If no ID is provided, redirect or show an error
    header("Location: accommodations_table.php?msg=Invalid accommodation ID");
    exit();
}
?>
