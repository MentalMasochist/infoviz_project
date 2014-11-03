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

$sql = "LOAD DATA LOCAL INFILE 'proper_subjects.csv'
        INTO TABLE arXiv_db.subjects
        FIELDS TERMINATED BY '\t'
        (paper_id, set_spec, subject_name)
        ";

$retval = mysql_query( $sql, $conn );
if(! $retval )
{
  die('Could not load into table: ' . mysql_error());
}
echo "Data loaded into subjects table successfully<br \>";

mysql_close($conn);
?>