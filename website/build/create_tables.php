<?php
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';

// connect to database
$conn = mysql_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
  die('Could not connect: ' . mysql_error());
}
echo 'Connected successfully<br />';

// create papers table
$sql = "CREATE TABLE IF NOT EXISTS arXiv_db.papers( ".
       "paper_id VARCHAR(150) NOT NULL, ".
       "title VARCHAR(100) NOT NULL, ".
       "date_of_submission DATE NOT NULL, ".
       "set_spec VARCHAR(40) NOT NULL, ".
       "description TEXT NOT NULL, ".
       "PRIMARY KEY ( paper_id, set_spec )); ";
$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo "Papers table created successfully <br />";

// create authors table
$sql = "CREATE TABLE IF NOT EXISTS arXiv_db.authors( ".
       "paper_id VARCHAR(150) NOT NULL, ".
       "set_spec VARCHAR(40) NOT NULL, ".
       "author_name VARCHAR(500) NOT NULL, ".
       "PRIMARY KEY ( paper_id, set_spec, author_name )); ";
$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo "Authors table created successfully <br />";

// create subjects table
$sql = "CREATE TABLE IF NOT EXISTS arXiv_db.subjects( ".
       "paper_id VARCHAR(150) NOT NULL, ".
       "set_spec VARCHAR(40) NOT NULL, ".
       "subject_name VARCHAR(500) NOT NULL, ".
       "PRIMARY KEY ( paper_id, set_spec, subject_name )); ";

$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo "Subjects table created successfully <br />";
mysql_close($conn);
?>