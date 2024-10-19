<?php

use CeyvoyApi\Model\Classes\Connectors\DBConnector;

$province = array(
    "central",
    "eastern",
    "north-central",
    "northern",
    "north-western",
    "sabaragamuwa",
    "southern",
    "uva",
    "western"
);

try {
    $conn = DBConnector::getConnection();
    // get total number of travelers , guides and accommodations from user table
    $sql = "SELECT COUNT(*) as total_travelers FROM user WHERE role = 'TRAVELER'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_travelers = $stmt->fetch(PDO::FETCH_ASSOC);

    // this month created travelers
    $sql = "SELECT COUNT(*) as total_travelers FROM user WHERE role = 'TRAVELER' AND MONTH(created_at) = MONTH(CURRENT_DATE())";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_travelers_this_month = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql = "SELECT COUNT(*) as total_guides FROM user WHERE role = 'GUIDE'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_guides = $stmt->fetch(PDO::FETCH_ASSOC);

    // this month created guides
    $sql = "SELECT COUNT(*) as total_guides FROM user WHERE role = 'GUIDE' AND MONTH(created_at) = MONTH(CURRENT_DATE())";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_guides_this_month = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql = "SELECT COUNT(*) as total_accommodations FROM accommodations";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_accommodations = $stmt->fetch(PDO::FETCH_ASSOC);

    // this month created accommodations
    $sql = "SELECT COUNT(*) as total_accommodations FROM accommodations WHERE MONTH(created_at) = MONTH(CURRENT_DATE())";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_accommodations_this_month = $stmt->fetch(PDO::FETCH_ASSOC);

    // get total events and events count by province
    $sql = "SELECT COUNT(*) as total_events FROM events";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_events = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql = "SELECT province, COUNT(*) as total_events FROM events GROUP BY province";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $events_by_province = array();

    // loop through the results and add to the events_by_province array
    $events_by_province = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // if any province is missing add it with 0 count
    foreach ($province as $prov) {
        $found = false;
        foreach ($events_by_province as $event) {
            if ($event["province"] == $prov) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            $events_by_province[] = array("province" => $prov, "total_events" => 0);
        }
    }

    // get locations and location count by province
    $sql = "SELECT COUNT(*) as total_locations FROM locations";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_locations = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql = "SELECT province, COUNT(*) as total_locations FROM locations GROUP BY province";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $locations_by_province = array();

    // loop through the results and add to the locations_by_province array
    $locations_by_province = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // if any province is missing add it with 0 count
    foreach ($province as $prov) {
        $found = false;
        foreach ($locations_by_province as $loc) {
            if ($loc["province"] == $prov) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            $locations_by_province[] = array("province" => $prov, "total_locations" => 0);
        }
    }

    // return the results
    echo json_encode(array(
        "status" => "success",
        "total_travelers" => $total_travelers["total_travelers"],
        "monthly_travelers_gain" => $total_travelers_this_month["total_travelers"],
        "total_guides" => $total_guides["total_guides"],
        "monthly_guides_gain" => $total_guides_this_month["total_guides"],
        "total_accommodations" => $total_accommodations["total_accommodations"],
        "monthly_accommodations_gain" => $total_accommodations_this_month["total_accommodations"],
        "total_events" => $total_events["total_events"],
        "total_locations" => $total_locations["total_locations"],
        "events_by_province" => $events_by_province,
        "locations_by_province" => $locations_by_province
    ));
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
    exit();
}
