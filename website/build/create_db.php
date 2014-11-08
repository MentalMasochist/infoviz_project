<?php
$servername = 'localhost';
$username = 'root';
$password = 'e5ye5ye5y';

// Create connection
$conn = mysqli_connect($servername, $username, $password);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS arXiv_db;";
if (mysqli_query($conn, $sql)) {
    echo " - database created successfully";
} else {
    echo "Error creating database: " . mysqli_error($conn);
}
mysqli_close($conn);
?>