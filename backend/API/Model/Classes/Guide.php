<?php

namespace CeyvoyApi\Model\Classes;

use PDO;
use PDOException;

class Guide extends User
{
    private $id;
    private $license;
    private $description;
    private $rating;
    private $cost;
    private $contact;
    private $is_verified;
    private $experience;
    private $user;
    private $languages;

    // default constructor
    public function __construct()
    {
        parent::__construct();
    }

    // setters
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setLicense($license)
    {
        $this->license = $license;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setRating($rating)
    {
        $this->rating = $rating;
    }

    public function setCost($cost)
    {
        $this->cost = $cost;
    }

    public function setContact($contact)
    {
        $this->contact = $contact;
    }

    public function setIsVerified($is_verified)
    {
        $this->is_verified = $is_verified;
    }

    public function setExperience($experience)
    {
        $this->experience = $experience;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function setLanguages($languages)
    {
        $this->languages = $languages;
    }

    // getters
    public function getId()
    {
        return $this->id;
    }

    public function getLicense()
    {
        return $this->license;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getRating()
    {
        return $this->rating;
    }

    public function getCost()
    {
        return $this->cost;
    }

    public function getContact()
    {
        return $this->contact;
    }

    public function getIsVerified()
    {
        return $this->is_verified;
    }

    public function getExperience()
    {
        return $this->experience;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getLanguages()
    {
        return $this->languages;
    }

    /**
     *  get all guides with their languages and their user details
     * @param PDO $conn
     * @return json string
     */
    public function getGuides(PDO $conn)
    {
        try {
            $query = "SELECT g.*, u.name, u.email, GROUP_CONCAT(gl.language) as languages FROM guide g LEFT JOIN guide_languages gl ON g.id = gl.guide LEFT JOIN user u ON g.user = u.id GROUP BY g.id";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $guides = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "data" => $guides
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     * get not verified guides with their languages and their user details
     * @param ODO $con
     * @return json string
     */
    public function getNotVerifiedGuides(PDO $conn)
    {
        try {
            $query = "SELECT g.*, u.name, u.email, GROUP_CONCAT(gl.language) as languages FROM guide g LEFT JOIN guide_languages gl ON g.id = gl.guide LEFT JOIN user u ON g.user = u.id WHERE g.is_verified = 0 GROUP BY g.id";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $guides = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(
                array(
                    "status" => "success",
                    "guides" => $guides
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     *  get guide by user id
     * @param PDO $conn
     * @param int $user_id
     * @return array
     * @return null
     */
    public static function getGuideByUserId(PDO $conn, int $user_id)
    {
        try {
            // get guide with all guide's languages in guide_languages
            $query = "SELECT g.*, GROUP_CONCAT(gl.language) as languages FROM guide g LEFT JOIN guide_languages gl ON g.id = gl.guide WHERE g.user = :user_id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $guide = $stmt->fetch(PDO::FETCH_ASSOC);
            return $guide;
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     *  add guide
     * @param PDO $conn
     * @return json string
     */
    public function addGuide(PDO $conn)
    {
        try {
            $query = "INSERT INTO guide (license, description, cost, contact, experience, user) VALUES (:license, :description, :cost, :contact, :experience, :user)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':license', $this->license);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':cost', $this->cost);
            $stmt->bindParam(':contact', $this->contact);
            $stmt->bindParam(':experience', $this->experience);
            $stmt->bindParam(':user', $this->user);
            $stmt->execute();


            // get guide id
            $query = "SELECT id FROM guide WHERE user = :user";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user', $this->user);
            $stmt->execute();
            $guide = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $guide['id'];

            // save languages in guide_languages table
            $languages = explode(",", $this->languages);
            foreach ($languages as $language) {
                $query = "INSERT INTO guide_languages (guide, language) VALUES (:guide, :language)";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':guide', $this->id);
                $stmt->bindParam(':language', $language);
                $stmt->execute();
            }

            return json_encode(
                array(
                    "status" => "success",
                    "message" => "Guide added successfully"
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     *  update guide
     * @param PDO $conn
     * @return json string
     */
    public function updateGuide(PDO $conn)
    {
        try {
            $query = "UPDATE guide SET license = :license, description = :description, cost = :cost, contact = :contact, experience = :experience WHERE user = :user";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':license', $this->license);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':cost', $this->cost);
            $stmt->bindParam(':contact', $this->contact);
            $stmt->bindParam(':experience', $this->experience);
            $stmt->bindParam(':user', $this->user);
            $stmt->execute();

            // get guide id
            $query = "SELECT id FROM guide WHERE user = :user";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user', $this->user);
            $stmt->execute();
            $guide = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $guide['id'];

            // delete all languages of guide
            $query = "DELETE FROM guide_languages WHERE guide = :guide";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':guide', $this->id);
            $stmt->execute();

            // save languages in guide_languages table
            $languages = explode(",", $this->languages);
            foreach ($languages as $language) {
                $query = "INSERT INTO guide_languages (guide, language) VALUES (:guide, :language)";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':guide', $this->id);
                $stmt->bindParam(':language', $language);
                $stmt->execute();
            }

            return json_encode(
                array(
                    "status" => "success",
                    "message" => "Guide updated successfully"
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }

    /**
     *  approve guide
     * @param PDO $conn
     * @return json string
     */
    public function approveGuide(PDO $conn)
    {
        try {
            $query = "UPDATE guide SET is_verified = 1 WHERE user = :user";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user', $this->user);
            $stmt->execute();
            return json_encode(
                array(
                    "status" => "success",
                    "message" => "Guide approved successfully"
                )
            );
        } catch (PDOException $e) {
            die("Error occurred : " . $e->getMessage());
        }
    }
}
