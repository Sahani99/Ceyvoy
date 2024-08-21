<?php
include 'db_connect.php';

// Queries to get user counts
$travellers_query = "SELECT COUNT(*) as count FROM users WHERE user_role='Traveler'";
$tourguides_query = "SELECT COUNT(*) as count FROM users WHERE user_role='Tour Guide'";
$accommodations_query = "SELECT COUNT(*) as count FROM users WHERE user_role='Accommodation'";
$total_users_query = "SELECT COUNT(*) as count FROM users"; // Total users

// Execute queries
$travellers_result = $conn->query($travellers_query);
$tourguides_result = $conn->query($tourguides_query);
$accommodations_result = $conn->query($accommodations_query);
$total_users_result = $conn->query($total_users_query);

// Fetch counts
$travellers_count = $travellers_result->fetch_assoc()['count'];
$tourguides_count = $tourguides_result->fetch_assoc()['count'];
$accommodations_count = $accommodations_result->fetch_assoc()['count'];
$total_users_count = $total_users_result->fetch_assoc()['count'];

// Calculate percentages
$travellers_percentage = ($total_users_count > 0) ? ($travellers_count / $total_users_count) * 100 : 0;
$tourguides_percentage = ($total_users_count > 0) ? ($tourguides_count / $total_users_count) * 100 : 0;
$accommodations_percentage = ($total_users_count > 0) ? ($accommodations_count / $total_users_count) * 100 : 0;

// Close database connection
$conn->close();

// Facebook API setup
$page_id = '401771653017947';
$access_token = 'EAAV7UTw6ZBVABO7uu8I99pMxsRzfbRiTkMk5rMBimqJ5llbZCrJtCXGoTI8t53GfOyOCqnswRawFZBJVFRTZBbZBTkGGl9bVEbMbBkdHSjMA9pZBmS4B6atcGY67bZCAnqw2yHkuTT4ZCNirUcLfQxPY0VJoC8kAjXkXGnUTBUa6uJuSrOrew4qnonw0NFUjqZB1k';

$fb_api_url = "https://graph.facebook.com/$page_id?fields=fan_count&access_token=$access_token";
$fb_likes = 'N/A';  // Default value

// Fetch Facebook page likes
$page_data = @file_get_contents($fb_api_url);

if ($page_data !== FALSE) {
    $page_data = json_decode($page_data);
    $fb_likes = $page_data->fan_count ?? 0;
} else {
    // Log error for debugging
    error_log("Failed to fetch Facebook likes. URL: $fb_api_url");
}

function getInstagramFollowers($accessToken, $userId) {
    // Instagram Graph API URL
    $url = "https://graph.instagram.com/$userId?fields=followers_count&access_token=$accessToken";

    // Initialize cURL session
    $ch = curl_init();

    // Set the URL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // Execute cURL session
    $output = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    // Decode JSON response
    $data = json_decode($output, true);

    // Return the followers count
    return isset($data['followers_count']) ? $data['followers_count'] : 0;
}

// Example usage
$accessToken = 'IGQWRQbTNGanY1bkxvNnhlcHZAudU42UnZAOYUdkaDlRN1UwMVhYVy1vei1YdGlVVVlKczdmSWVoVjFuc19QNGNaZAll3MGJRd1R5UVdmUjJiVnFMZATc0bVFmRWUwaGVWRGI1TFZArU1NpLUJqWDEtbF9sSEJrZA2dUQmcZD';
$userId = '17841467313649004';
$followers = getInstagramFollowers($accessToken, $userId);




?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="Dashboard description" />
    <meta name="keywords" content="admin templates, dashboard templates, etc."/>
    <meta name="author" content="CodedThemes"/>
    <link rel="stylesheet" href="assets/fonts/fontawesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="assets/plugins/animation/css/animate.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <h1 class="db_header">User Details</h1>
    <div class="pcoded-main-container">
        <div class="pcoded-wrapper">
            <div class="pcoded-content">
                <div class="pcoded-inner-content">
                    <div class="main-body">
                        <div class="page-wrapper">
                            <div class="row">
                                <!-- Travelers section -->
                                <div class="col-md-6 col-xl-4">
                                    <a href="includes/travelers_table.php" style="text-decoration: none; color: inherit;">
                                        <div class="card daily-sales">
                                            <div class="card-block">
                                                <h6 class="mb-4">Travelers</h6>
                                                <div class="row d-flex align-items-center">
                                                    <div class="col-9">
                                                        <h3 class="f-w-300 d-flex align-items-center m-b-0">
                                                            <i class="fas fa-users text-c-green f-30 m-r-10"></i>
                                                            <?php echo $travellers_count; ?>
                                                        </h3>
                                                    </div>
                                                    <div class="col-3 text-right">
                                                        <p class="m-b-0"><?php echo round($travellers_percentage, 2); ?>%</p>
                                                    </div>
                                                </div>
                                                <div class="progress m-t-30" style="height: 7px;">
                                                    <div class="progress-bar progress-c-theme" role="progressbar" style="width: <?php echo $travellers_percentage; ?>%;" aria-valuenow="<?php echo $travellers_percentage; ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                
                                <!-- Tourguides section -->
                                <div class="col-md-6 col-xl-4">
                                    <a href="includes/tourguides_table.php" style="text-decoration: none; color: inherit;">
                                        <div class="card Monthly-sales">
                                            <div class="card-block">
                                                <h6 class="mb-4">Tourguides</h6>
                                                <div class="row d-flex align-items-center">
                                                    <div class="col-9">
                                                        <h3 class="f-w-300 d-flex align-items-center m-b-0">
                                                            <i class="fas fa-map-signs text-c-red f-30 m-r-10"></i>
                                                            <?php echo $tourguides_count; ?>
                                                        </h3>
                                                    </div>
                                                    <div class="col-3 text-right">
                                                        <p class="m-b-0"><?php echo round($tourguides_percentage, 2); ?>%</p>
                                                    </div>
                                                </div>
                                                <div class="progress m-t-30" style="height: 7px;">
                                                    <div class="progress-bar progress-c-theme2" role="progressbar" style="width: <?php echo $tourguides_percentage; ?>%;" aria-valuenow="<?php echo $tourguides_percentage; ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                
                                <!-- Accommodations section -->
                                <div class="col-md-12 col-xl-4">
                                    <a href="includes/accommodations_table.php" style="text-decoration: none; color: inherit;">
                                        <div class="card yearly-sales">
                                            <div class="card-block">
                                                <h6 class="mb-4">Accommodations</h6>
                                                <div class="row d-flex align-items-center">
                                                    <div class="col-9">
                                                        <h3 class="f-w-300 d-flex align-items-center m-b-0">
                                                            <i class="fas fa-bed text-c-green f-30 m-r-10"></i>
                                                            <?php echo $accommodations_count; ?>
                                                        </h3>
                                                    </div>
                                                    <div class="col-3 text-right">
                                                        <p class="m-b-0"><?php echo round($accommodations_percentage, 2); ?>%</p>
                                                    </div>
                                                </div>
                                                <div class="progress m-t-30" style="height: 7px;">
                                                    <div class="progress-bar progress-c-theme" role="progressbar" style="width: <?php echo $accommodations_percentage; ?>%;" aria-valuenow="<?php echo $accommodations_percentage; ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <h1 class="db_header2">Social Media Stats</h1>
    <div class="pcoded-main-container">
        <div class="pcoded-wrapper">
            <div class="pcoded-content">
                <div class="pcoded-inner-content">
                    <div class="main-body">
                        <div class="page-wrapper">
                            <div class="row">
                                <!-- Facebook Stats -->
                                <div class="col-md-12 col-xl-4">
                                    <div class="card card-social">
                                        <div class="card-block border-bottom">
                                            <div class="row align-items-center justify-content-center">
                                                <div class="col-auto">
                                                    <i class="fab fa-facebook-f text-c-blue f-30"></i>
                                                </div>
                                                <div class="col">
                                                    <h6 class="m-b-0">Facebook Page Likes</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-block">
                                            <h3 class="m-b-0">
                                            <i class="fas fa-thumbs-up text-c-blue f-30 m-r-10"></i>   
                                            <?php echo number_format($fb_likes); ?></h3>
                                        </div>
                                    </div>
                                </div>
                                <!-- End of Facebook Stats -->
                                 <!-- Instagram Stats -->
                                <div class="col-md-12 col-xl-4">
                                    <div class="card card-social">
                                        <div class="card-block border-bottom">
                                            <div class="row align-items-center justify-content-center">
                                                <div class="col-auto">
                                                <i class="fab fa-instagram text-c-red f-30"></i>
                                                </div>
                                                <div class="col">
                                                    <h6 class="m-b-0">Instagram Followers</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-block">
                                            <h3 class="m-b-0">
                                            <i class="fas fa-heart text-c-red f-30 m-r-10"></i>
                                            <?php echo "Followers: $followers<br>"; ?>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <!-- End of Instagram Stats -->
                                  <!-- Links -->
                                <div class="col-md-12 col-xl-4">
                                    <div class="card card-social">
                                        <a href="https://www.facebook.com/profile.php?id=61564009542186" target="_blank">
                                            <div class="card-block border-bottom">
                                                <div class="row align-items-center justify-content-center">
                                                    <div class="col-auto">
                                                        <i class="fab fa-facebook-f text-c-blue f-30"></i>
                                                    </div>
                                                    <div class="col">
                                                    <h6 class="m-b-0">Ceyvoy FaceBook</h6> 
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        <a href="#" target="_blank">
                                            <div class="card-block border-bottom">
                                                <div class="row align-items-center justify-content-center">
                                                    <div class="col-auto">
                                                        <i class="fab fa-instagram text-c-red f-30"></i>
                                                    </div>
                                                    <div class="col">
                                                    <h6 class="m-b-0">Ceyvoy Instagram</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <!-- End of Links -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>