<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit();
}

include 'includes/db_connect.php';
include 'includes/header.php';
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="css/nav.css">
</head>
<body>
    <!-- <h1>Welcome to the Admin Dashboard</h1> -->
    <!-- <a href="logout.php">Logout</a> -->
</body>
</html>

<?php include 'includes/footer.php'; ?>
