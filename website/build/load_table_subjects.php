<?php
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'e5ye5ye5y';
$database = 'arXiv_db';

// connect to database
$server = mysql_connect($dbhost, $dbuser, $dbpass);
$conn = mysql_select_db($database, $server);

if(! $conn )
{
  die('Could not connect: ' . mysql_error());
}
echo ' - connected successfully<br />';

$sql = " LOAD DATA LOCAL INFILE 'proper_subjects.csv' ".
       "     INTO TABLE subjects                      ".
       "     FIELDS TERMINATED BY '\t'                ".
       "     LINES TERMINATED BY '\n'                 ".
       "     (paper_id, set_spec, subject_name);      ";

$retval = mysql_query( $sql, $conn );

if(! $retval )
{
  die('Could not load into table: ' . mysql_error());
}

echo " - authors table loaded successfully<br />";

mysql_close($conn);
?>