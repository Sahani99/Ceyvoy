<?php

namespace CeyvoyApi\Model\Classes;

use PDO;
use PDOException;

class Locations
{
    private $id;
    private $title;
    private $description;
    private $city;
    private $province;
    private $category;
    private $latitude;
    private $longitude;
    private $image;
    private $status;
    private $created_at;
    private $updated_at;
    private $created_by;
    private $updated_by;

    // default constructor
    public function __construct() {}

    // setters
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setCity($city)
    {
        $this->city = $city;
    }

    public function setProvince($province)
    {
        $this->province = $province;
    }

    public function setCategory($category)
    {
        $this->category = $category;
    }

    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
    }

    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function setStatus($status)
    {
        $this->status = $status;
    }

    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }

    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    public function setCreatedBy($created_by)
    {
        $this->created_by = $created_by;
    }

    public function setUpdatedBy($updated_by)
    {
        $this->updated_by = $updated_by;
    }

    // getters
    public function getId()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getCity()
    {
        return $this->city;
    }

    public function getProvince()
    {
        return $this->province;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getLatitude()
    {
        return $this->latitude;
    }

    public function getLongitude()
    {
        return $this->longitude;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    public function getCreatedBy()
    {
        return $this->created_by;
    }

    public function getUpdatedBy()
    {
        return $this->updated_by;
    }

    /**
     * Get locations based on the status
     * @param $connection
     * @return json string
     */
    public function getLocationsByStatus($connection)
    {
        try {
            $query = "SELECT * FROM locations WHERE status = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->status);
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get locations based on the status with search params with title and city
     * @param $connection
     * @param $search
     * @return json string
     */
    public function getLocationsByStatusWithSearch($connection, $search)
    {
        try {
            $query = "SELECT * FROM locations WHERE status = ? AND (title LIKE ? OR city LIKE ?)";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->status);
            $stmt->bindValue(2, "%$search%");
            $stmt->bindValue(3, "%$search%");
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get location based on the id
     * @param $connection
     * @return json string
     */
    public function getLocationsById($connection)
    {
        try {
            $query = "SELECT * FROM locations WHERE id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->id);
            $stmt->execute();
            $results =  $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Add location
     * @param $connection
     * @return json string
     */
    public function addLocation($connection)
    {
        try {
            $query = "INSERT INTO locations (title, description, city, province, category, latitude, longitude, image, status , created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?)";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->title);
            $stmt->bindValue(2, $this->description);
            $stmt->bindValue(3, $this->city);
            $stmt->bindValue(4, $this->province);
            $stmt->bindValue(5, $this->category);
            $stmt->bindValue(6, $this->latitude);
            $stmt->bindValue(7, $this->longitude);
            $stmt->bindValue(8, $this->image);
            $stmt->bindValue(9, $this->status);
            $stmt->bindValue(10, $this->created_by);
            $stmt->bindValue(11, $this->updated_by);
            $stmt->execute();
            http_response_code(201);
            return json_encode(array("status" => "success", "message" => "Location added successfully"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Update location
     * @param $connection
     * @return json string
     */

    public function updateLocation($connection)
    {
        try {
            $query = "UPDATE locations SET title = ?, description = ?, city = ?, province = ?, category = ?, latitude = ?, longitude = ?, image = ? , updated_at = now() , updated_by = ? WHERE id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->title);
            $stmt->bindValue(2, $this->description);
            $stmt->bindValue(3, $this->city);
            $stmt->bindValue(4, $this->province);
            $stmt->bindValue(5, $this->category);
            $stmt->bindValue(6, $this->latitude);
            $stmt->bindValue(7, $this->longitude);
            $stmt->bindValue(8, $this->image);
            $stmt->bindValue(9, $this->updated_by);
            $stmt->bindValue(10, $this->id);
            $stmt->execute();
            http_response_code(200);
            return json_encode(array("status" => "success", "message" => "Location updated successfully"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     *  Approve or reject location
     * @param $connection
     * @return json string
     */
    public function approveOrRejectLocation($connection)
    {
        try {
            $query = "UPDATE locations SET status = ? , updated_at = now() , updated_by = ? WHERE id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->status);
            $stmt->bindValue(2, $this->updated_by);
            $stmt->bindValue(3, $this->id);
            $stmt->execute();
            http_response_code(200);
            return json_encode(array("status" => "success", "message" => "Location updated successfully"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     *  Get all locations by created by
     * @param $connection
     * @return json string
     */
    public function getLocationsByCreatedBy($connection)
    {
        try {
            $query = "SELECT * FROM locations WHERE created_by = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->created_by);
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get all locations by created by with search params with title and city
     * @param $connection
     * @param $search
     * @return json string
     */
    public function getLocationsByCreatedByWithSearch($connection, $search)
    {
        try {
            $query = "SELECT * FROM locations WHERE created_by = ? AND (title LIKE ? OR city LIKE ?)";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->created_by);
            $stmt->bindValue(2, "%$search%");
            $stmt->bindValue(3, "%$search%");
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get all locations by one of the categories from categories array
     * @param $connection
     * @param $categories 
     * @return json string
     */
    public function getLocationsByCategories($connection, $categories)
    {
        try {
            $query = "SELECT * FROM locations WHERE category IN (" . implode(',', array_fill(0, count($categories), '?')) . ") AND status = 'APPROVED'";
            $stmt = $connection->prepare($query);
            $stmt->execute($categories);
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "locations" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }
}
