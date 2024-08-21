<?php
session_start();

include 'db_connect.php';

// Step 2: Handle delete operation
if (isset($_GET['delete_id'])) {
    $delete_id = (int)$_GET['delete_id']; // Sanitize input
    $delete_query = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $delete_query->bind_param("i", $delete_id);
    
    if ($delete_query->execute()) {
        header("Location: tourguide_details.php");
        exit(); // Ensure no further code is executed
    } else {
        // Output the SQL error for debugging
        echo "Error deleting record: " . $delete_query->error;
    }
    
    $delete_query->close();
}

// Step 3: Fetch tour guide details with profile pictures
$tourguides_query = "
    SELECT u.user_id, u.username, u.email
    FROM users u
    LEFT JOIN tourguides t ON u.user_id = t.user_id 
    WHERE u.user_role = 'Tour Guide'";
$tourguides_result = $conn->query($tourguides_query);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tour Guide Details</title>

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
                                                        <h2>Tour Guide Details</h2>
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
                                if ($tourguides_result->num_rows > 0) {
                                    while ($row = $tourguides_result->fetch_assoc()) {
                                        echo "<tr>";
                                        echo "<td class='td'>" . htmlspecialchars($row['user_id']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['username']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['email']) . "</td>";
                                        echo "<td class='td'>
                                                <a href='tourguide-delete.php?id=" . htmlspecialchars($row['user_id']) . "' 
                                                onclick='return confirm(\"Are you sure you want to delete this tour guide?\");'>
                                                Delete
                                                </a>
                                            </td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td class='td' colspan='4'>No tour guides found.</td></tr>";
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
