<?php
// Database connection configuration
$host = 'localhost';
$username = 'your_username';
$password = 'your_password';
$database = 'uba';

// Function to decrypt encrypted text
function decryptEnc($encrypted)
{
    $encryptionMethod = "AES-256-CBC";
    $secretKey = "0TCJJ59QzctD8LXi+SUrhoHwxq+41t@1";
    $iv = "QzctD8LXi+SUrhoH";

    $decryptedText = openssl_decrypt($encrypted, $encryptionMethod, $secretKey, 0, $iv);
    return $decryptedText;
}

// Function to check if text is encrypted (base64 encoded or contains typical encryption patterns)
function isEncrypted($text)
{
    // Check if text is base64 encoded (common for encrypted data)
    if (preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $text)) {
        $decoded = base64_decode($text, true);
        if ($decoded !== false && strlen($decoded) > 0) {
            // Additional check: if decoded contains non-printable characters or appears encrypted
            if (preg_match('/[^\x20-\x7E]/', $decoded)) {
                return true;
            }
        }
    }
    return false;
}

try {
    // Create database connection using MySQLi
    $conn = new mysqli($host, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare the SQL query to select required fields
    $sql = "SELECT id, text, dlr_status, created_at, msisdn FROM OTPmessages";

    // Execute the query
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    // Check if there are results
    if ($result->num_rows > 0) {
        echo "<h3>OTP Messages</h3>";
        echo "<table border='1' cellpadding='10' cellspacing='0'>";
        echo "<tr>";
        echo "<th>ID</th>";
        echo "<th>Text (Original)</th>";
        echo "<th>Text (Decrypted)</th>";
        echo "<th>DLR Status</th>";
        echo "<th>Created At</th>";
        echo "<th>MSISDN</th>";
        echo "</tr>";

        // Fetch and process each row
        while ($row = $result->fetch_assoc()) {
            $originalText = $row['text'];
            $decryptedText = $originalText; // Default to original if not encrypted

            // Check if the text is encrypted and try to decrypt it
            if (!empty($originalText) && isEncrypted($originalText)) {
                $attemptDecrypt = decryptEnc($originalText);
                if ($attemptDecrypt !== false && $attemptDecrypt !== null) {
                    $decryptedText = $attemptDecrypt;
                }
            }

            // Display the row
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['id']) . "</td>";
            echo "<td>" . htmlspecialchars(substr($originalText, 0, 50)) . (strlen($originalText) > 50 ? "..." : "") . "</td>";
            echo "<td>" . htmlspecialchars($decryptedText) . "</td>";
            echo "<td>" . htmlspecialchars($row['dlr_status']) . "</td>";
            echo "<td>" . htmlspecialchars($row['created_at']) . "</td>";
            echo "<td>" . htmlspecialchars($row['msisdn']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";

        echo "<p>Total records: " . $result->num_rows . "</p>";
    } else {
        echo "No records found.";
    }

    // Close the result set and connection
    $result->free();
    $conn->close();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}
