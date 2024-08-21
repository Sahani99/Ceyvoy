<?php
session_start();

include 'db_connect.php';

// Step 2: Handle delete operation
if (isset($_GET['delete_id'])) {
    $delete_id = (int)$_GET['delete_id']; // Sanitize input
    
    // Start a transaction
    $conn->begin_transaction();

    try {
        // First delete from the accomadations table
        $delete_accommodation_query = $conn->prepare("DELETE FROM accomadations WHERE user_id = ?");
        $delete_accommodation_query->bind_param("i", $delete_id);
        $delete_accommodation_query->execute();
        $delete_accommodation_query->close();

        // Then delete from the users table
        $delete_user_query = $conn->prepare("DELETE FROM users WHERE user_id = ?");
        $delete_user_query->bind_param("i", $delete_id);
        $delete_user_query->execute();
        $delete_user_query->close();

        // Commit the transaction
        $conn->commit();

        // Redirect after successful deletion
        header("Location: accommodations_table.php");
        exit(); // Ensure no further code is executed

    } catch (mysqli_sql_exception $exception) {
        $conn->rollback(); // Rollback the transaction on error
        echo "Error deleting record: " . $exception->getMessage();
    }
}

// Fetch accommodation details
$accommodations_query = "
    SELECT u.user_id, u.username, u.email 
    FROM users u
    LEFT JOIN accommodations a ON u.user_id = a.user_id 
    WHERE u.user_role = 'Accommodation'";

$accommodations_result = $conn->query($accommodations_query);

// Close the database connection at the end of the script
// $conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Accommodation Details</title>

    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <link rel="stylesheet" href="../assets/fonts/fontawesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="../assets/plugins/animation/css/animate.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="pcoded-main-container">
    <div class="pcoded-wrapper">
        <div class="pcoded-content">
            <div class="pcoded-inner-content">
                <div class="main-body">
                    <div class="page-wrapper">
                        <div class="header">
                            <h2>Accommodation Details</h2>
                            <a class="logout-btn" id="logoutBtn" href="add_accommodation.php">Add a new accomodation</a>
                            <a class="logout-btn" id="logoutBtn" href="../dashboard.php">Dashboard</a>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="th">User ID</th>
                                    <th class="th">Name</th>
                                    <th class="th">Email</th>
                                    <th class="th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if ($accommodations_result->num_rows > 0) {
                                    while ($row = $accommodations_result->fetch_assoc()) {
                                        echo "<tr>";
                                        echo "<td class='td'>" . htmlspecialchars($row['user_id']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['username']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['email']) . "</td>";
                                        echo "<td class='td'>
                                                <a href='accommodation-delete.php?id=" . htmlspecialchars($row['user_id']) . "' 
                                                   onclick='return confirm(\"Are you sure you want to delete this accommodation?\");'>
                                                   Delete
                                                </a>
                                              </td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td class='td' colspan='4'>No accommodations found.</td></tr>";
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php 
$conn->close();
?>

</body>
</html>
