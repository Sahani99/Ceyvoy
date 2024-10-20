<?php

namespace CeyvoyApi\Model\Classes;

use PDO;
use PDOException;

class Trip
{

    private $id;
    private $language;
    private $date_from;
    private $date_to;
    private $locations;
    private $environment;
    private $accommodations;
    private $accommodation_prices;
    private $guide;
    private $budget;
    private $people;
    private $user;

    // default constructor
    public function __construct() {}

    // getters
    public function getId()
    {
        return $this->id;
    }

    public function getLanguage()
    {
        return $this->language;
    }

    public function getDateFrom()
    {
        return $this->date_from;
    }

    public function getDateTo()
    {
        return $this->date_to;
    }

    public function getLocations()
    {
        return $this->locations;
    }

    public function getEnvironment()
    {
        return $this->environment;
    }

    public function getAccommodations()
    {
        return $this->accommodations;
    }

    public function getAccommodationPrices()
    {
        return $this->accommodation_prices;
    }

    public function getGuide()
    {
        return $this->guide;
    }

    public function getBudget()
    {
        return $this->budget;
    }

    public function getPeople()
    {
        return $this->people;
    }

    public function getUser()
    {
        return $this->user;
    }

    // setters

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function setLanguage($language)
    {
        $this->language = $language;
        return $this;
    }

    public function setDateFrom($date_from)
    {
        $this->date_from = $date_from;
        return $this;
    }

    public function setDateTo($date_to)
    {
        $this->date_to = $date_to;
        return $this;
    }

    public function setLocations($locations)
    {
        $this->locations = $locations;
        return $this;
    }

    public function setEnvironment($environment)
    {
        $this->environment = $environment;
        return $this;
    }

    public function setAccommodations($accommodations)
    {
        $this->accommodations = $accommodations;
        return $this;
    }

    public function setAccommodationPrices($accommodation_prices)
    {
        $this->accommodation_prices = $accommodation_prices;
        return $this;
    }

    public function setGuide($guide)
    {
        $this->guide = $guide;
        return $this;
    }

    public function setBudget($budget)
    {
        $this->budget = $budget;
        return $this;
    }

    public function setPeople($people)
    {
        $this->people = $people;
        return $this;
    }

    public function setUser($user)
    {
        $this->user = $user;
        return $this;
    }


    /**
     * get accommodations by accommodation city
     * if no accommodation found for any city it will add empty array for it
     * this function use $location array to get accommodations. it contains location ids
     * @param $conn
     * @param $location array
     * @return array
     */
    public function getAccommodationsByLocations($conn, $locations)
    {
        try {
            $accommodations = array();
            foreach ($locations as $location) {
                // get location using location id from location table
                $query = "SELECT * from locations WHERE id = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $location);
                $stmt->execute();
                $location = $stmt->fetch(PDO::FETCH_ASSOC);
                // get accommodations using location id from accommodation table
                $query = "SELECT * from accommodations WHERE city = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $location['city']);
                $stmt->execute();
                $accommodations[$location['city']] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $accommodations;
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    /**
     * get guide if they have no work during the date range in travels table.
     * it joins guide and user table to get guide details
     * also join guide_languages table to filter only selected language guide
     * @param $conn
     * @param $date_from
     * @param $date_to
     * @param $language
     * @return array
     */
    public function getGuidesByDateRange($conn, $date_from, $date_to, $language)
    {
        try {
            $query = "SELECT guide.* , user.name , user.email FROM guide LEFT JOIN user ON guide.user = user.id 
            LEFT JOIN guide_languages ON guide.id = guide_languages.guide WHERE guide.id NOT IN (SELECT guide FROM travels 
            WHERE arrival >= ? AND departure <= ?
            ) AND guide_languages.language = ?";
            $stmt = $conn->prepare($query);
            $stmt->bindValue(1, $date_from);
            $stmt->bindValue(2, $date_to);
            $stmt->bindValue(3, $language);
            $stmt->execute();
            $guides = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $guides;
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    /**
     * save new travel details in travels table
     * @param $conn
     * @return json string
     */
    public function saveTravel($conn)
    {
        try {
            // first save travel details in travels table
            $query = "INSERT INTO travels (user, persons , arrival , departure , environments ,
            budget , language , guide) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bindValue(1, $this->getUser());
            $stmt->bindValue(2, $this->getPeople());
            // convert date to mysql date format
            $stmt->bindValue(3, $this->getDateFrom());
            $stmt->bindValue(4, $this->getDateTo());
            $stmt->bindValue(5, $this->getEnvironment());
            $stmt->bindValue(6, $this->getBudget());
            $stmt->bindValue(7, $this->getLanguage());
            $stmt->bindValue(8, $this->getGuide());
            $stmt->execute();
            // get last inserted id
            $last_id = $conn->lastInsertId();
            // save accommodation details and cost in travel_accommodations table
            $index = 0;
            foreach ($this->getAccommodations() as $accommodation) {
                $cost = $this->getAccommodationPrices()[$index];
                $query = "INSERT INTO travels_accommodations (travel, accommodations, cost) VALUES (?, ?, ?)";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $last_id);
                $stmt->bindValue(2, $accommodation);
                $stmt->bindValue(3, $cost);
                $stmt->execute();
            }

            // save location details in travel_location table
            foreach ($this->getLocations() as $location) {
                $query = "INSERT INTO travels_location (travel, location) VALUES (?, ?)";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $last_id);
                $stmt->bindValue(2, $location);
                $stmt->execute();
            }

            return json_encode(array("status" => "success", "message" => "Travel details saved successfully"));
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    /**
     * get tour details for traveler.
     * @param $conn
     * @param $user
     * @return json string
     */
    public function getTravelerTravels($conn, $user)
    {
        try {
            // get travel and guide details from travels , guide and user table
            $query = "SELECT travels.* , guide.contact as guide_contact , user.name as guide_name FROM travels
            LEFT JOIN guide ON travels.guide = guide.id
            LEFT JOIN user ON guide.user = user.id
            WHERE travels.user = ?";
            $stmt = $conn->prepare($query);
            $stmt->bindValue(1, $user);
            $stmt->execute();
            $travels = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // get accommodations and location details for each travel
            foreach ($travels as $key => $travel) {
                // get details with join accommodations table
                $query = "SELECT accommodations.* FROM travels_accommodations
                LEFT JOIN accommodations ON travels_accommodations.accommodations = accommodations.id WHERE travel = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $travel['id']);
                $stmt->execute();
                $accommodations = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $travels[$key]['accommodations'] = $accommodations;
                // get details with join locations table
                $query = "SELECT locations.* FROM travels_location LEFT JOIN locations ON travels_location.location = locations.id WHERE travel = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $travel['id']);
                $stmt->execute();
                $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $travels[$key]['locations'] = $locations;
            }

            return json_encode(array("status" => "success", "travels" => $travels));
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    /**
     * get all travels for guide
     * @param $conn
     * @param $guide
     * @return json string
     */
    public function getGuideTravels($conn, $guide)
    {
        try {
            // get travel and user details from travels and user table
            $query = "SELECT travels.* , user.name as traveler_name FROM travels
            LEFT JOIN user ON travels.user = user.id
            WHERE travels.guide = ?";
            $stmt = $conn->prepare($query);
            $stmt->bindValue(1, $guide);
            $stmt->execute();
            $travels = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // get accommodations and location details for each travel
            foreach ($travels as $key => $travel) {
                // get details with join accommodations table
                $query = "SELECT accommodations.* FROM travels_accommodations
                LEFT JOIN accommodations ON travels_accommodations.accommodations = accommodations.id WHERE travel = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $travel['id']);
                $stmt->execute();
                $accommodations = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $travels[$key]['accommodations'] = $accommodations;
                // get details with join locations table
                $query = "SELECT locations.* FROM travels_location LEFT JOIN locations ON travels_location.location = locations.id WHERE travel = ?";
                $stmt = $conn->prepare($query);
                $stmt->bindValue(1, $travel['id']);
                $stmt->execute();
                $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $travels[$key]['locations'] = $locations;
            }

            return json_encode(array("status" => "success", "travels" => $travels));
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    /**
     * update travel status
     * @param $conn
     * @param $id
     * @param $status
     * @return json string
     */
    public function updateTravelStatus($conn, $id, $status)
    {
        try {
            $query = "UPDATE travels SET guide_status = ? WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bindValue(1, $status);
            $stmt->bindValue(2, $id);
            $stmt->execute();
            return json_encode(array("status" => "success", "message" => "Travel status updated successfully"));
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}
