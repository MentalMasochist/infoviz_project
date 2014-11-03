<?php
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$conn = mysql_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
  die('Could not connect: ' . mysql_error());
}
echo 'Connected successfully<br />';

$sql = "LOAD DATA LOCAL INFILE 'papers.csv'
        INTO TABLE arXiv_db.papers
        FIELDS TERMINATED BY '\t'
        (paper_id, title, date_of_submission, set_spec, description)
        ";

$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not load into table: ' . mysql_error());
}
echo "Data loaded into papers table successfully<br \>";

mysql_close($conn);
?>