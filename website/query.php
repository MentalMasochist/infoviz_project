<?php

function f_mysql_query($query) {
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

	$retval = mysql_query( $query );

	if(! $retval )
	{
	  die('Could not load into table: ' . mysql_error());
	}

	$data = array();
    
    for ($x = 0; $x < mysql_num_rows($retval); $x++) {
        $data[] = mysql_fetch_assoc($retval);
    }
    
    echo json_encode($data);  

	mysql_close($conn);
}

// print_r($_POST);

// define variables
$form_subjects = $_POST["subjects"];
$form_authors = $_POST["authors"];
$form_keywords = $_POST["keywords"];
$query_papers = "";

// check if inputs exist
if (empty($form_subjects)) {
	$active_subjects = FALSE; 
} else {
	$active_subjects = TRUE;
	$arr_subjects = explode(",", $form_subjects);
}

if (empty($form_authors)) {
	$active_authors = FALSE;
} 	else {
	$active_authors = TRUE;
	$arr_authors = explode(",", $form_authors);
}

if (empty($form_keywords)) {
	$active_keywords = FALSE;
} else {
	$active_keywords = TRUE;
	$arr_keywords = explode(",", $form_keywords);
	foreach ($arr_keywords as &$value) {
		$query_papers = $query_papers.' +'.trim($value);
	}
}

//////////////////////
// create full queries
//////////////////////

$query_papers = " SELECT paper_id, dt_created FROM papers                  ".
                "     WHERE MATCH (title, description)                     ".
                "     AGAINST ('".trim($query_papers)."' IN BOOLEAN MODE); ";

// perform query
f_mysql_query($query_papers);

?>