<?php

$host = "127.0.0.1";
$user = "root";
$pass = "RingoVas1@#$";
$db   = "uba";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// File path (same directory)
$file = __DIR__ . "/messages2347059483068.csv";

$output = fopen($file, "w");

if (!$output) {
    die("Failed to create file");
}

// Column headers
fputcsv($output, [
    'id',
    'msisdn',
    'pages',
    'text',
    'response',
    'dlr_status',
    'dlr_report',
    'created_at',
    'updated_at',
    'dlr',
    'status',
    'senderid',
    'counter',
    'dlr_request',
    'dlr_results',
    'network'
]);

$sql = "SELECT * FROM messages WHERE msisdn = '2347059483068'";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    fputcsv($output, $row);
}

fclose($output);
$conn->close();

echo "messages.csv created successfully!";
