<?php

namespace CeyvoyApi\Model\Classes;

use PDO;
use PDOException;

class Events
{
    private $id;
    private $title;
    private $description;
    private $city;
    private $province;
    private $category;
    private $start;
    private $end;
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

    public function setStart($start)
    {
        $this->start = $start;
    }

    public function setEnd($end)
    {
        $this->end = $end;
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

    public function getStart()
    {
        return $this->start;
    }

    public function getEnd()
    {
        return $this->end;
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
     * Add event
     * @param $connection
     * @return json string
     */
    public function addEvent($connection)
    {
        try {
            $query = "INSERT INTO events (title, description, city, province, category, start, end, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->title);
            $stmt->bindValue(2, $this->description);
            $stmt->bindValue(3, $this->city);
            $stmt->bindValue(4, $this->province);
            $stmt->bindValue(5, $this->category);
            $stmt->bindValue(6, $this->start);
            $stmt->bindValue(7, $this->end);
            $stmt->bindValue(8, $this->image);
            $stmt->execute();
            http_response_code(201);
            return json_encode(array("status" => "success", "message" => "Event added successfully"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Update event
     * @param $connection
     * @return json string
     */

    public function updateEvent($connection)
    {
        try {
            $query = "UPDATE events SET title = ?, description = ?, city = ?, province = ?, category = ?, start = ?, end = ?, image = ? , updated_at = now() WHERE id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, $this->title);
            $stmt->bindValue(2, $this->description);
            $stmt->bindValue(3, $this->city);
            $stmt->bindValue(4, $this->province);
            $stmt->bindValue(5, $this->category);
            $stmt->bindValue(6, $this->start);
            $stmt->bindValue(7, $this->end);
            $stmt->bindValue(8, $this->image);
            $stmt->bindValue(9, $this->id);
            $stmt->execute();
            http_response_code(200);
            return json_encode(array("status" => "success", "message" => "Event updated successfully"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get all events by created by with search params with title and city
     * @param $connection
     * @param $search
     * @return json string
     */
    public function getEventsBySearch($connection, $search)
    {
        try {
            $query = "SELECT * FROM events WHERE (title LIKE ? OR city LIKE ?)";
            $stmt = $connection->prepare($query);
            $stmt->bindValue(1, "%$search%");
            $stmt->bindValue(2, "%$search%");
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "events" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Get all events
     * @param $connection
     * @return json string
     */
    public function getEvents($connection)
    {
        try {
            $query = "SELECT * FROM events";
            $stmt = $connection->prepare($query);
            $stmt->execute();
            $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => "success", "events" => $results));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }
}
