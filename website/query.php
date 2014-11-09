<html>
<body>
<?php

// inputs
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'e5ye5ye5y';
$database = 'arXiv_db';

// connect to database
$server = mysql_connect($dbhost, $dbuser, $dbpass);
$conn = mysql_select_db($database, $server);


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
    
    echo json_encode($data);  
}

// // establish db connection
// activate_mysql_connection();

// define variables
$form_subjects = $_POST["subjects"];
$form_authors = $_POST["authors"];
$form_papers = $_POST["keywords"];
$query_subjects = "";
$query_authors = "";
$query_papers = "";

$counter_subjects = 0;
$counter_authors = 0;

// check if inputs exist
if (empty($form_subjects)) {
	$active_subjects = FALSE;
	$table_subjects = "subjects"; 
	echo "no inputs";
	echo "<br />";
} else {
	$active_subjects = TRUE;
	$table_subjects = "temp_subjects";
	$arr_subjects = explode(",", $form_subjects);
	foreach ($arr_subjects as &$value) {
		$query_subjects = $query_subjects.' '.trim($value);
		$counter_subjects = $counter_subjects + 1; 
	}  

	$query = " CREATE TEMPORARY TABLE temp_subjects AS (                                              ".
			 " SELECT s.paper_id                                                                      ".
			 "     FROM subjects s                                                                    ".
			 "     WHERE MATCH (s.subject_name) AGAINST ('".trim($query_subjects)."' IN BOOLEAN MODE) ".
			 "     GROUP BY s.paper_id                                                                ".
			 "     HAVING count(s.paper_id) = ".$counter_subjects."                                   ".
			 " );                                                                                     ";
	echo $query;
	echo "<br /><br />";

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	echo "temp table created<br />";
	f_mysql_query("SELECT count(paper_id) FROM temp_subjects;");	
	echo "<br /><br />";
}

if (empty($form_authors)) {
	$active_authors = FALSE;
	$table_authors = "authors";
	echo "no inputs";
	echo "<br />";
} else {
	$active_authors = TRUE;
	$table_authors = "temp_authors";
	$arr_authors = explode(",", $form_authors);
	foreach ($arr_authors as &$value) {
		$query_authors = $query_authors.' '.trim($value);
		$counter_authors = $counter_authors + 1; 
	}
    $query = " CREATE TEMPORARY TABLE temp_authors AS (                                     ".
             " SELECT a.paper_id                                                            ".
             "     FROM authors a                                                           ".
             "     WHERE MATCH (a.author_name) AGAINST ('".trim($query_authors)."' IN BOOLEAN MODE) ".
             "     GROUP BY a.paper_id                                                      ".
             "     HAVING count(a.paper_id) = ".$counter_authors."                          ".
             " );                                                                           ";
	echo $query;
	echo "<br /><br />";

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	echo "temp table created<br />";
	f_mysql_query("SELECT count(paper_id) FROM temp_authors;");	
	echo "<br /><br />";
}


if (empty($form_papers)) {
	$active_papers = FALSE;
	$table_papers = "papers";
	echo "no inputs";
	echo "<br />";
} else {
	$active_papers = TRUE;
	$table_papers = "temp_papers";
	$arr_papers = explode(",", $form_papers);
	foreach ($arr_papers as &$value) {
		$query_papers = $query_papers.' +'.trim($value);
	}
	$query = " CREATE TEMPORARY TABLE temp_papers AS (                                                    ".
			 "     SELECT p.paper_id                                                                      ".
			 "         FROM papers p                                                                      ".
			 "         WHERE MATCH (p.title, p.description) AGAINST ('".trim($query_papers)."' IN BOOLEAN MODE) ".
			 " );                                                                                         ";
	echo $query;
	echo "<br /><br />";

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	echo "temp table created<br />";
	f_mysql_query("SELECT count(paper_id) FROM temp_papers;");	
	echo "<br /><br />";
}

// inner join temp tables

echo $table_papers;
echo "<br/><br/>";
echo $table_authors;
echo "<br/><br/>";
echo $table_subjects;
echo "<br/><br/>";

$query = "CREATE TEMPORARY TABLE active_papers AS (  ".
         " SELECT tp.paper_id                        ".
         "     FROM ".$table_papers." tp             ".
         "     INNER JOIN ".$table_authors." ta      ".
         "     ON ta.paper_id = tp.paper_id          ".
         "     INNER JOIN ".$table_subjects." ts     ".
         "     ON ts.paper_id = tp.paper_id          ".
         " );                                        ";

echo $query;
echo "<br /><br />";
mysql_query($query);	
// $query = "SELECT count(ap.paper_id) AS count_paper,                ".
// "       year(dt_created) AS yr,                        ".
// "       month(dt_created) AS mn                        ".
// "       FROM papers p                                    ".
// "       INNER JOIN active_papers ap".
// "        ON p.paper_id = ap.paper_id".
// "       GROUP BY year(dt_created), month(dt_created); ";

$query = " select count(subject_name) as count_sub, subject_name ".
" from subjects                                         ".
" inner join active_papers                              ".
" on active_papers.paper_id = subjects.paper_id         ".
" group by subject_name                                 ".
" order by count_sub desc;                              ";


f_mysql_query($query);	

mysql_close($conn);

?>
</body>
</html>
