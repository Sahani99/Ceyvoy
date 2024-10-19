<?php

namespace CeyvoyApi\Model\Classes;

use PDO;
use PDOException;

class Accommodations
{
    private $id;
    private $name;
    private $address;
    private $category;
    private $city;
    private $website;
    private $max_guests;
    private $price;
    private $description;
    private $contact_no;
    private $facilities;
    private $image;
    private $user;

    // default constructor
    public function __construct() {}

    // setters
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setAddress($address)
    {
        $this->address = $address;
    }

    public function setCategory($category)
    {
        $this->category = $category;
    }

    public function setCity($city)
    {
        $this->city = $city;
    }

    public function setWebsite($website)
    {
        $this->website = $website;
    }

    public function setMaxGuests($max_guests)
    {
        $this->max_guests = $max_guests;
    }

    public function setPrice($price)
    {
        $this->price = $price;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setContactNo($contact_no)
    {
        $this->contact_no = $contact_no;
    }

    public function setFacilities($facilities)
    {
        $this->facilities = $facilities;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    // getters
    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getAddress()
    {
        return $this->address;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getCity()
    {
        return $this->city;
    }

    public function getWebsite()
    {
        return $this->website;
    }

    public function getMaxGuests()
    {
        return $this->max_guests;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getContactNo()
    {
        return $this->contact_no;
    }

    public function getFacilities()
    {
        return $this->facilities;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getUser()
    {
        return $this->user;
    }

    /**
     * Fetch all accommodations
     * @param PDO $conn
     * @return json string
     */
    public function fetchAll(PDO $conn)
    {
        try {
            $stmt = $conn->prepare("SELECT * FROM accommodations");
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "accommodations" => $results
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * Fetch accommodation user
     * @param PDO $conn
     * @return json string
     */
    public function fetchByUser(PDO $conn)
    {
        try {
            $stmt = $conn->prepare("SELECT * FROM accommodations WHERE user = ?");
            $stmt->bindValue(1, $this->user);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "accommodations" => $results
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * Fetch accommodations by city
     * @param PDO $conn
     * @return json string
     */
    public function fetchByCity(PDO $conn)
    {
        try {
            $stmt = $conn->prepare("SELECT * FROM accommodations WHERE city = ?");
            $stmt->bindValue(1, $this->city);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "accommodations" => $results
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * Add new accommodation
     * @param PDO $conn
     * @return json string
     */
    public function addAccommodation(PDO $conn)
    {
        try {
            $stmt = $conn->prepare("INSERT INTO accommodations (name, address, category, city, website, max_guests, description, contact_no, facilities, image , user , price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bindValue(1, $this->name);
            $stmt->bindValue(2, $this->address);
            $stmt->bindValue(3, $this->category);
            $stmt->bindValue(4, $this->city);
            $stmt->bindValue(5, $this->website);
            $stmt->bindValue(6, $this->max_guests);
            $stmt->bindValue(7, $this->description);
            $stmt->bindValue(8, $this->contact_no);
            $stmt->bindValue(9, $this->facilities);
            $stmt->bindValue(10, $this->image);
            $stmt->bindValue(11, $this->user);
            $stmt->bindValue(12, $this->price);
            $stmt->execute();
            return json_encode(
                array(
                    "status" => "success",
                    "message" => "Accommodation added successfully"
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * Update accommodation
     * @param PDO $conn
     * @return json string
     */
    public function updateAccommodation(PDO $conn)
    {
        try {
            $stmt = $conn->prepare("UPDATE accommodations SET name = ?, address = ?, category = ?, city = ?, website = ?, max_guests = ?, description = ?, contact_no = ?, facilities = ?, image = ? , updated_at = now() , price = ? WHERE id = ?");
            $stmt->bindValue(1, $this->name);
            $stmt->bindValue(2, $this->address);
            $stmt->bindValue(3, $this->category);
            $stmt->bindValue(4, $this->city);
            $stmt->bindValue(5, $this->website);
            $stmt->bindValue(6, $this->max_guests);
            $stmt->bindValue(7, $this->description);
            $stmt->bindValue(8, $this->contact_no);
            $stmt->bindValue(9, $this->facilities);
            $stmt->bindValue(10, $this->image);
            $stmt->bindValue(11, $this->price);
            $stmt->bindValue(12, $this->id);
            $stmt->execute();
            return json_encode(
                array(
                    "status" => "success",
                    "message" => "Accommodation updated successfully"
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * search accommodation by name or city
     * @param PDO $conn
     * @param string $search
     * @return json string
     */
    public function searchAccommodation(PDO $conn, $search)
    {
        try {
            $stmt = $conn->prepare("SELECT * FROM accommodations WHERE name LIKE ? OR city LIKE ?");
            $stmt->bindValue(1, "%$search%");
            $stmt->bindValue(2, "%$search%");
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "accommodations" => $results
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }
}
