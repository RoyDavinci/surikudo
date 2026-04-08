<?php

$host = "localhost";
$db   = "providus";
$user = "providus";
$pass = "RingoVas1@#$";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// INPUTS
$email = "emsthias33@gmail.com";
$newPassword = "davinci1"; // change this

// HASH PASSWORD (bcrypt)
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

// PREPARED STATEMENT (secure)
$stmt = $conn->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?");
$stmt->bind_param("ss", $hashedPassword, $email);

if ($stmt->execute()) {
    echo "Password updated successfully";
} else {
    echo "Error updating password: " . $stmt->error;
}

$stmt->close();
$conn->close();
