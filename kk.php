#!/usr/bin/env php
<?php

/**
 * Usage:
 *   php decrypt_csv.php input.csv output.csv
 */

define('ENCRYPTION_METHOD', 'AES-256-CBC');
define('SECRET_KEY', '0TCJJ59QzctD8LXi+SUrhoHwxq+41t@1');
define('IV', 'QzctD8LXi+SUrhoH');

if ($argc < 3) {
    fwrite(STDERR, "Usage: php decrypt_csv.php <input.csv> <output.csv>\n");
    exit(1);
}

$inputFile  = $argv[1];
$outputFile = $argv[2];

if (!file_exists($inputFile)) {
    fwrite(STDERR, "Error: Input file '$inputFile' not found.\n");
    exit(1);
}

// ─── Decrypt helper ─────────────────────────────────────────

function decryptEnc($encrypted)
{
    // Clean surrounding junk (quotes, spaces, pipes)
    $encrypted = trim($encrypted, " \t\n\r\0\x0B\"'|");

    if ($encrypted === '') {
        return '';
    }

    // Fix possible base64 corruption (ONLY if needed)
    // Some systems replace + with space
    if (strpos($encrypted, ' ') !== false) {
        $encrypted = str_replace(' ', '+', $encrypted);
    }

    $decrypted = openssl_decrypt(
        $encrypted,
        ENCRYPTION_METHOD,
        SECRET_KEY,
        0,
        IV
    );

    return $decrypted !== false ? $decrypted : '';
}

// ─── Process ───────────────────────────────────────────────

$inHandle  = fopen($inputFile, 'r');
$outHandle = fopen($outputFile, 'w');

if (!$inHandle) {
    fwrite(STDERR, "Error: Cannot open input file.\n");
    exit(1);
}
if (!$outHandle) {
    fwrite(STDERR, "Error: Cannot open output file.\n");
    exit(1);
}

// Header
fputcsv($outHandle, ['text', 'msisdn', 'status', 'created_at'], ',', '"', '\\');

$processed = 0;
$failed    = 0;
$lineNum   = 0;

while (($row = fgetcsv($inHandle)) !== false) {
    $lineNum++;

    if (empty($row) || !isset($row[0])) {
        continue;
    }

    // The entire line is inside first column
    $line = trim($row[0]);

    // Remove wrapping quotes if present
    $line = trim($line, "\"'");

    // Now split manually by pipe
    $parts = array_map('trim', explode('|', $line));

    // Remove empty entries caused by leading/trailing pipe
    $parts = array_values(array_filter($parts, fn($v) => $v !== ''));

    if (count($parts) < 4) {
        fwrite(STDERR, "Skipping line $lineNum\n");
        $failed++;
        continue;
    }

    $encryptedText = $parts[0];
    $msisdn        = $parts[1];
    $status        = $parts[2];
    $createdAt     = $parts[3];

    $decrypted = decryptEnc($encryptedText);

    if ($decrypted === '') {
        fputcsv($outHandle, ['[DECRYPT_FAILED]', $msisdn, $status, $createdAt], ',', '"', '\\');
        $failed++;
        continue;
    }

    fputcsv($outHandle, [$decrypted, $msisdn, $status, $createdAt], ',', '"', '\\');
    $processed++;
}

fclose($inHandle);
fclose($outHandle);

echo "Done.\n";
echo "Processed: $processed rows\n";
echo "Failed   : $failed rows\n";
echo "Output   : $outputFile\n";
