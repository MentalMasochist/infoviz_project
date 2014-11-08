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

$sql = " LOAD DATA LOCAL INFILE 'papers_test.csv'                       ".
       "     INTO TABLE papers                                     ".
       "     FIELDS TERMINATED BY '\t'                             ".
       "     LINES TERMINATED BY '\n'                              ".
       "     (paper_id, title, dt_created, set_spec, description); ";

$retval = mysql_query( $sql );

if(! $retval )
{
  die('Could not load into table: ' . mysql_error());
}
echo " - papers table loaded successfully<br />";

mysql_close( $conn );
?>