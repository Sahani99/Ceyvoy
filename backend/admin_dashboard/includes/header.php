<?php
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="css/nav.css">
    <link rel='stylesheet' href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css'>
</head>
<body>
    <header>
        <main>
                <nav class="headnav">
                    <div> 
                <h1>Welcome to the Admin Dashboard</h1>
                    </div>
                    <div class="profile">
                        <div class="user">
                            <h3>Admin Name</h3>
                            <p>@admin_username</p>
                        </div>
                        <div class="img-box">
                            <img src="https://i.postimg.cc/BvNYhMHS/user-img.jpg" alt="some user image">
                        </div>
                    </div>
                </nav>
                <?php include 'includes/dashboard_data.php'; ?>
        </main>
     <aside>
        <nav>
            <ul>
            <li>
            <a href="#" data-resize-btn>
                <i class="bx bx-chevrons-right"></i>
                <span>Collapse</span>
                </a>
            </li>
            <li>
                <a href="dashboard.php" class="active">
                <i class="bx bx-home-circle"></i>
                <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="includes/travelers_table.php">
                <i class="fas fa-users"></i>
                <span>Travelers</span>
                </a>
            </li>
            <li>
                <a href="includes/tourguides_table.php">
                <i class="fas fa-map-signs"></i>
                <span>Tourguides</span>
                </a>
            </li>
            <li>
                <a href="includes/accommodations_table.php">
                <i class="fas fa-bed"></i>
                <span>Accommodations</span>
                </a>
            </li>
            <li>
                <a href="includes/add_accommodation.php">
                <i class="fas fa-plus"></i>
                <span>Add Locations</span>
                </a>
            </li>
            <li>
                <a href="#">
                <i class="fas fa-calendar-plus"></i>
                <span>Add a Event</span>
                </a>
            </li>
            <li>
                <a href="#">
                <i class="bx bx-cog"></i>
                <span>Settings</span>
                </a>
            </li>
            <li>
                <a id="logoutBtn" href="logout.php">
                    <i class="bx bx-log-out"></i>
                    <span>Logout</span>
                </a>
            </li>
            </ul>
        </nav>
    </aside>

     </header>
        <script src="js/script.js"></script>
        <script src="js/headnav.js"></script>
    </body>
</html>