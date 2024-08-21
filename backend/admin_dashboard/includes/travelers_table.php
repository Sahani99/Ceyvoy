<?php
session_start();

include 'db_connect.php';

// Step 2: Handle delete operation
if (isset($_GET['delete_id'])) {
    $delete_id = (int)$_GET['delete_id']; // Sanitize input
    $delete_query = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $delete_query->bind_param("i", $delete_id);
    
    if ($delete_query->execute()) {
        header("Location: traveler_details.php");
        exit(); // Ensure no further code is executed
    } else {
        // Output the SQL error for debugging
        echo "Error deleting record: " . $delete_query->error;
    }
    
    $delete_query->close();
}

// Step 3: Fetch traveler details with profile pictures
$travellers_query = "
    SELECT u.user_id, u.username, u.email, t.image 
    FROM users u
    LEFT JOIN travelers t ON u.user_id = t.user_id 
    WHERE u.user_role = 'Traveler'";

$travellers_result = $conn->query($travellers_query);

// Close the database connection at the end of the script
// $conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Traveler Details</title>

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
                            <h2>Traveler Details</h2>
                            <a class="logout-btn" id="logoutBtn" href="../dashboard.php">Dashboard</a>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="th">User ID</th>
                                    <th class="th">Name</th>
                                    <th class="th">Email</th>
                                    <th class="th">Profile Picture</th>
                                    <th class="th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if ($travellers_result->num_rows > 0) {
                                    while ($row = $travellers_result->fetch_assoc()) {
                                        echo "<tr>";
                                        echo "<td class='td'>" . htmlspecialchars($row['user_id']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['username']) . "</td>";
                                        echo "<td class='td'>" . htmlspecialchars($row['email']) . "</td>";
                                        echo "<td class='td'>";
                                        if ($row['image']) {
                                            // Display the image
                                            $profilePic = base64_encode($row['image']);
                                            echo "<img class='img' src='data:image/jpeg;base64,$profilePic' alt='Profile Picture'>";
                                        } else {
                                            echo "No Picture";
                                        }
                                        echo "</td>";
                                        echo "<td class='td'>
                                                <a href='traveler-delete.php?id=" . htmlspecialchars($row['user_id']) . "' 
                                                   onclick='return confirm(\"Are you sure you want to delete this traveler?\");'>
                                                   Delete
                                                </a>
                                              </td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td class='td' colspan='5'>No travelers found.</td></tr>";
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