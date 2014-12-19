<?php

// needed for large queries
set_time_limit(0);
ini_set('memory_limit', '-1');

$debug = False;

function f_mysql_query($query) {

	$retval = mysql_query( $query );

	if(! $retval )
	{
	  die('Could not load into table: ' . mysql_error());
	}

	$data = array();
    
    for ($x = 0; $x < mysql_num_rows($retval); $x++) {
        $data[] = mysql_fetch_assoc($retval);
    }
    
    return json_encode($data);  
}

// inputs
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$database = 'arXiv_db';

// connect to database
$server = mysql_connect($dbhost, $dbuser, $dbpass);
$conn = mysql_select_db($database, $server);

$query = " SELECT count(subject_name) AS count_sub, gen_subject_name, subject_name ".
         "     FROM subjects s                                                     ".
         "     GROUP BY s.subject_name                                             ".
         "     ORDER BY count_sub DESC                                             ".
         "     LIMIT 50;                                                           ";

echo f_mysql_query($query);	

mysql_close($server);

?>