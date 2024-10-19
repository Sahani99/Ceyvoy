<?php

namespace CeyvoyApi\Model\Classes;

use CeyvoyApi\Model\Classes\Connectors\EmailConnector;
use Firebase\JWT\JWT;
use PDO;
use PDOException;

class User
{

    private $id;
    private $name;
    private $email;
    private $password;
    private $role;
    private $created_at;
    private $updated_at;
    private $is_active;
    private $is_verified;

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

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function setRole($role)
    {
        $this->role = $role;
    }

    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }

    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    public function setIsActive($is_active)
    {
        $this->is_active = $is_active;
    }

    public function setIsVerified($is_verified)
    {
        $this->is_verified = $is_verified;
    }

    // getters
    public function getName()
    {
        return $this->name;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function getRole()
    {
        return $this->role;
    }

    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    public function getIsActive()
    {
        return $this->is_active;
    }

    public function getIsVerified()
    {
        return $this->is_verified;
    }

    /**
     * Check if the user is new or not by checking the email in the database.
     * @param $connection PDO
     * @param $email string
     * @param $statusOnly bool : default false
     * @return bool 
     * @return array
     */
    public static function isNewUser($connection, $email, $statusOnly = false)
    {
        $query = "SELECT * from user where email = ?";
        try {
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $email);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            if ($statusOnly) {
                return empty($result);
            } else {
                return $result;
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }


    /**
     * Handle the session of the user.
     * @param $connection PDO
     * @return json string
     */
    public function login($connection)
    {
        $results = User::isNewUser($connection, $this->email);

        if (!empty($results) && password_verify($this->password, $results[0]["password"])) {
            $result = $results[0];

            if ($result["is_verified"]) {
                $this->role = $result["role"];
                $this->name = $result["name"];
                $this->handleAuth();
                $guide = null;

                // if the user is guide
                if ($result["role"] === "GUIDE") {
                    $guide = Guide::getGuideByUserId($connection, $result["id"]);
                }

                http_response_code(200);
                return json_encode(array(
                    "status" => 200,
                    "redirect" => "/dashboard",
                    "user" => array(
                        "name" => $results[0]["name"],
                        "email" => $results[0]["email"],
                        "role" => $results[0]["role"],
                        "profileImage" => $results[0]["profile_image"],
                        "guide" => $guide
                    ),

                ));
            } elseif (!$result["is_verified"]) {
                http_response_code(400);
                return json_encode(array(
                    "status" => 400,
                    "property" => "not_verified",
                    "message" => "Email not verified"
                ));
            }
        } else {
            http_response_code(400);
            return json_encode(array(
                "status" => 400,
                "property" => "password",
                "message" => "Invalid Email or Password"
            ));
        }
    }

    /**
     * Handle the authentication of the user.
     */
    public function handleAuth()
    {
        $payload = array(
            "name" => $this->name,
            "email" => $this->email,
            "role" => $this->role
        );
        $jwt = JWT::encode($payload, $_ENV["JWT_SECRET"], "HS256");

        // set cookie for 30 days
        setcookie('auth', $jwt, time() + (30 * 24 * 60 * 60), '/');
    }

    /**
     * Register the user.
     * @param $connection PDO
     * @return json string
     */
    public function register($connection)
    {
        $query = "INSERT into user (email , password , name, role ) values(?,?,?,?)";
        try {

            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->email);
            $pstmt->bindValue(2, password_hash($this->password, PASSWORD_BCRYPT));
            $pstmt->bindValue(3, $this->name);
            $pstmt->bindValue(4, $this->role);
            $pstmt->execute();
            // check if the user is registered
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Registration Failed"));
            } else {
                // set user id
                $this->id = $connection->lastInsertId();
                // send verification email
                $this->sendVerificationEmail($connection, "Verify your email", "sign_up");
                http_response_code(201);
                return json_encode(array("status" => 200, "message" => "Registration Successful. Please verify your email"));
            }
        } catch (PDOException $ex) {
            die("Registration Error : " . $ex->getMessage());
        }
    }

    /**
     * Logout the user.
     * @return json string
     */
    public function logout()
    {
        setcookie('auth', '', time() - 3600, '/');
        http_response_code(200);
        return json_encode(array("status" => 200, "message" => "Logged out"));
    }

    /**
     * Verify the user.
     * @param $connection PDO
     * @param $verificationCode string
     * @return json string
     */
    public function verifyEmail($connection, $verificationCode)
    {
        try {
            // get user id from verification table
            $query = "SELECT * from verification where code = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $verificationCode);
            $pstmt->execute();
            $rows = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $pstmt->rowCount();

            if ($count < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Invalid Verification Code"));
            } else {
                // get user id from deleted rows
                $user_id = $rows[0]["user"];
                // get expire date and time from $rows
                $expire_at = $rows[0]["expire_at"];
                // check if the code is expired
                if (strtotime($expire_at) < time()) {
                    http_response_code(400);
                    return json_encode(array(
                        "status" => 400,
                        "message" => "Verification Code Expired"
                    ));
                }
                // update user table
                $update_query = "UPDATE user set is_verified = 1 , updated_at = now() where id = ?";
                $pstmt = $connection->prepare($update_query);
                $pstmt->bindValue(1, $user_id);
                $pstmt->execute();

                // delete verification code
                $delete_query = "DELETE from verification where code = ?";
                $pstmt = $connection->prepare($delete_query);
                $pstmt->bindValue(1, $verificationCode);
                $pstmt->execute();

                http_response_code(200);
                return json_encode(array("status" => 200, "message" => "Email Verified"));
            }
        } catch (PDOException $ex) {
            die("Registration Error : " . $ex->getMessage());
        }
    }

    /**
     * Resend the verification email.
     * @param $connection PDO
     * @return json string
     */
    public function resendVerification($connection)
    {
        $results = User::isNewUser($connection, $this->email);
        if (!empty($results)) {
            $this->id = $results[0]["id"];
            $this->name = $results[0]["name"];
            $this->sendVerificationEmail($connection, "Email Verification", "sign_up");
            http_response_code(200);
            return json_encode(array("status" => 200, "message" => "Verification Email Sent"));
        } else {
            http_response_code(400);
            return json_encode(array("status" => 400, "message" => "Email not registered"));
        }
    }

    /**
     * Send the forgot password email.
     * @param $connection PDO
     * @return json string
     */
    public function forgotPassword($connection)
    {
        $results = User::isNewUser($connection, $this->email);
        if (!empty($results)) {
            $this->id = $results[0]["id"];
            $this->name = $results[0]["name"];
            $this->sendVerificationEmail($connection, "Reset Password", "reset_password");
            http_response_code(200);
            return json_encode(array("status" => 200, "message" => "Reset Password Email Sent"));
        } else {
            http_response_code(400);
            return json_encode(array("status" => 400, "message" => "Email not registered"));
        }
    }

    /**
     * Verify the reset code for resetting the password.
     * @param $connection PDO
     * @param $code string
     * @return json string
     */
    public function verifyResetCode($connection, $code)
    {
        $query = "SELECT * from verification where code = ?";
        $pstmt = $connection->prepare($query);
        $pstmt->bindValue(1, $code);
        $pstmt->execute();
        $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($result)) {
            http_response_code(400);
            return json_encode(array("status" => 400, "message" => "Invalid Verification Code"));
        } else {
            $this->id = $result[0]["user"];
            // get expire time
            $expire_at = $result[0]["expire_at"];
            // get user details
            $query = "SELECT * from user where id = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->id);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            $this->email = $result[0]["email"];
            $this->name = $result[0]["name"];
            // add * fro email and show only first 3 characters
            $this->email = substr($this->email, 0, 3) . "****" . substr($this->email, strpos($this->email, '@'));
            // check if the code is expired
            if (strtotime($expire_at) < time()) {
                http_response_code(400);
                return json_encode(array(
                    "status" => 400,
                    "message" => "Verification Code Expired"
                ));
            }
            http_response_code(200);
            return json_encode(array(
                "status" => 200,
                "email" => $this->email,
                "message" => "Code Verified"
            ));
        }
    }

    /**
     * Reset the password.
     * @param $connection PDO
     * @return json string
     */
    public function resetPassword($connection)
    {
        try {
            User::updatePassword($connection);
            // check http response code
            if (http_response_code() !== 200) {
                return json_encode(array("status" => 400, "message" => "Password Reset Failed"));
            }
            // delete verification code
            $query = "DELETE from verification where user = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->id);
            $pstmt->execute();
            http_response_code(200);
            return json_encode(array("status" => 200, "message" => "Password Reset Successful"));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Update the password.
     * @param $connection PDO
     * @return json string
     */
    public function updatePassword($connection)
    {
        $query = "UPDATE user set password = ? , updated_at = now() where id = ?";
        try {
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, password_hash($this->password, PASSWORD_BCRYPT));
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Password Update Failed"));
            } else {
                http_response_code(200);
                $this->logout();
                return json_encode(array("status" => 200, "message" => "Password Updated"));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Send the verification email.
     * @param $connection PDO
     * @return void
     */
    public function sendVerificationEmail($connection, $subject, $template)
    {
        // delete existing verification code for the user with join user table
        $delete_query = "DELETE verification from verification inner join user on verification.user = user.id where user.email = ?";
        $pstmt = $connection->prepare($delete_query);
        $pstmt->bindValue(1, $this->email);
        $pstmt->execute();

        $code = '';
        while (true) {
            $randomString = md5(uniqid(rand(), true));
            $code = substr($randomString, 0, 20);
            $check_query = "SELECT * from verification where code = ?";
            $pstmt = $connection->prepare($check_query);
            $pstmt->bindValue(1, $code);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) break;
        }

        $query = "INSERT into verification (code , user , expire_at) values(? , ? , date_add(now(),interval 1 day))";
        $pstmt = $connection->prepare($query);
        $pstmt->bindValue(1, $code);
        $pstmt->bindValue(2, $this->id);
        $pstmt->execute();

        $email_template = __DIR__ . "/Templates/$template.html";
        $message = file_get_contents($email_template);
        $message = str_replace('%user_name%', $this->name, $message);
        $message = str_replace('%user_email%', $this->email, $message);
        $message = str_replace('%code%', $code, $message);
        $email_connection = EmailConnector::getEmailConnection();

        $email_connection->msgHTML($message);
        $email_connection->addAddress($this->email, $this->name);
        $email_connection->Subject = $subject;
        $email_connection->send();
    }

    /**
     * Update the user's name.
     * @param $connection PDO
     * @return json string
     */
    public function updateName($connection)
    {
        $query = "UPDATE user set name = ? , updated_at = now() where id = ?";
        try {
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->name);
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Name Update Failed"));
            } else {
                // get user details
                $users = User::isNewUser($connection, $this->email);

                http_response_code(200);
                return json_encode(array(
                    "status" => 200,
                    "user" => array(
                        "name" => $users[0]["name"],
                        "email" => $users[0]["email"],
                        "role" => $users[0]["role"],
                        "profileImage" => $users[0]["profile_image"]
                    ),
                    "message" => "Name Updated"
                ));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Update the user's email.
     * @param $connection PDO
     * @return json string
     */
    public function updateEmail($connection)
    {
        $query = "UPDATE user set email = ? , updated_at = now() , is_verified = 0 where id = ?";
        try {
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->email);
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Email Update Failed"));
            } else {
                // logout user
                $this->logout();
                // resend verification email
                $this->sendVerificationEmail($connection, "Verify your email", "sign_up");

                http_response_code(200);
                return json_encode(array(
                    "status" => 200,
                    "message" => "Email Updated.Please Verify Your New Email."
                ));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * Update the user's avatar.
     * @param $connection PDO
     * @param $avatar string
     * @return json string
     */
    public function updateAvatar($connection, $avatar)
    {
        $query = "UPDATE user set profile_image = ? , updated_at = now() where id = ?";
        try {
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $avatar);
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Profile Picture Update Failed"));
            } else {
                // get user details
                $users = User::isNewUser($connection, $this->email);

                http_response_code(200);
                return json_encode(array(
                    "status" => 200,
                    "user" => array("name" => $users[0]["name"], "email" => $users[0]["email"], "role" => $users[0]["role"], "profileImage" => $users[0]["profile_image"]),
                    "message" => "Profile Picture Updated"
                ));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * save system feedbacks in system_feedback table
     * @param $connection PDO
     * @param $feedback string
     * @return json string
     */
    public function saveSystemFeedback($connection, $feedback)
    {
        try {
            $query = "INSERT into system_feedback (feedback , user) values(?,?)";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $feedback);
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Feedback not saved"));
            } else {
                http_response_code(200);
                return json_encode(array("status" => 200, "message" => "Feedback saved"));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * save guide feedbacks in guide_feedbacks table
     * @param $connection PDO
     * @param $rating int
     * @param $feedback string
     * @param $guide_id int
     */
    public function saveGuideFeedback($connection, $feedback, $guide_id, $rating)
    {
        try {
            $query = "INSERT into guide_feedback (feedback , traveler , guide , rating) values(?,?,?,?)";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $feedback);
            $pstmt->bindValue(2, $this->id);
            $pstmt->bindValue(3, $guide_id);
            $pstmt->bindValue(4, $rating);
            $pstmt->execute();
            // get ratings count and sum of ratings
            $query = "SELECT count(*) as count , sum(rating) as sum from guide_feedback where guide = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $guide_id);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $result[0]["count"];
            $sum = $result[0]["sum"];
            // calculate average rating to 2 decimal places
            $average = round($sum / $count, 2);
            // update guide table with average rating
            $query = "UPDATE guide set ratings = ? where id = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $average);
            $pstmt->bindValue(2, $guide_id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "Feedback not saved"));
            } else {
                http_response_code(200);
                return json_encode(array("status" => 200, "message" => "Feedback saved"));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * get system feedbacks from system_feedback table corresponding to user id
     * @param $connection PDO
     * @return json string
     */
    public function getSystemFeedbacks($connection)
    {
        try {
            // get with user's name by joining user table
            $query = "SELECT system_feedback.feedback , system_feedback.created_at , user.name from system_feedback inner join user on system_feedback.user = user.id";
            $pstmt = $connection->prepare($query);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => 200, "feedbacks" => $result));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * get guide feedbacks from guide_feedback table corresponding to user id
     * @param $connection PDO
     * @param $guide_id int
     * @return json string
     */
    public function getGuideFeedbacks($connection, $guide_id)
    {
        try {
            // get with user's name by joining user table
            $query = "SELECT guide_feedback.feedback , guide_feedback.rating , guide_feedback.created_at , user.name from guide_feedback 
            inner join user on guide_feedback.traveler = user.id where guide = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $guide_id);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode(array("status" => "success", "feedbacks" => $result));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * get all users details from user table
     * @param $connection PDO
     * @return json string
     */
    public function getUserDetails($connection)
    {
        try {
            $query = "SELECT * from user";
            $pstmt = $connection->prepare($query);
            $pstmt->execute();
            $result = $pstmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            return json_encode(array("status" => 200, "users" => $result));
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }

    /**
     * deactivate or activate user by setting is_active to 0 or 1
     * @param $connection PDO
     * @return json string
     */
    public function updateUserStatus($connection)
    {
        try {
            $query = "UPDATE user set is_active = ? where id = ?";
            $pstmt = $connection->prepare($query);
            $pstmt->bindValue(1, $this->is_active);
            $pstmt->bindValue(2, $this->id);
            $pstmt->execute();
            if ($pstmt->rowCount() < 1) {
                http_response_code(400);
                return json_encode(array("status" => 400, "message" => "User not updated"));
            } else {
                http_response_code(200);
                return json_encode(array("status" => 200, "message" => "User updated"));
            }
        } catch (PDOException $ex) {
            die("Error occurred : " . $ex->getMessage());
        }
    }
}
