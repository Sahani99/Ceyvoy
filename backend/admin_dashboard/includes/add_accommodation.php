<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Accommodation</title>
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
                                <h2>Add New Accommodation</h2>
                                <a class="logout-btn" id="logoutBtn" href="accommodations_table.php">Back to List</a>
                                <a class="logout-btn" id="logoutBtn" href="../dashboard.php">Dashboard</a>
                            </div>
                            <form action="add_accommodation_process.php" method="POST">
                                <label for="user_id">User ID:</label>
                                <input type="number" id="user_id" name="user_id" required>
                                <br>
                                <label for="name">Name:</label>
                                <input type="text" id="name" name="name" required>
                                <br>
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                                <br>
                                <input type="submit" value="Add Accommodation">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
