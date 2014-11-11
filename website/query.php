<?php

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
$dbpass = 'e5ye5ye5y';
$database = 'arXiv_db';

// connect to database
$server = mysql_connect($dbhost, $dbuser, $dbpass);
$conn = mysql_select_db($database, $server);

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
	if ($debug) {
		echo "no inputs";
		echo "<br />";
	}
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
	if ($debug) {
		echo $query;
		echo "<br /><br />";
	}

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	if ($debug) if ($debug){
		echo "temp table created<br />";
	}
	$ret = f_mysql_query("SELECT count(paper_id) FROM temp_subjects;");	
	if ($debug) {
		echo $ret;
		echo "<br /><br />";
	}
}

if (empty($form_authors)) {
	$active_authors = FALSE;
	$table_authors = "authors";
	if ($debug) {
		echo "no inputs";
		echo "<br />";
	}
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
	if ($debug) {
		echo $query;
		echo "<br /><br />";
	}

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	if ($debug){
		echo "temp table created<br />";
	}
	$ret = f_mysql_query("SELECT count(paper_id) FROM temp_authors;");	
	if ($debug) {
		echo $ret;
		echo "<br /><br />";
	}
}


if (empty($form_papers)) {
	$active_papers = FALSE;
	$table_papers = "papers";
	if ($debug) {
		echo "no inputs";
		echo "<br />";
	}
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
	if ($debug) {
		echo $query;
		echo "<br /><br />";
	}

	// creat temporary table
	if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
	if ($debug) {
		echo "temp table created<br />";
	}
	$ret = f_mysql_query("SELECT count(paper_id) FROM temp_papers;");	
	if ($debug) {
	echo $ret;
	echo "<br /><br />";
}
}

// inner join temp tables

if ($debug) {
	echo $table_papers;
	echo "<br/><br/>";
	echo $table_authors;
	echo "<br/><br/>";
	echo $table_subjects;
	echo "<br/><br/>";
}

$query = "CREATE TEMPORARY TABLE active_papers AS (  ".
         " SELECT DISTINCT tp.paper_id               ".
         "     FROM ".$table_papers." tp             ".
         "     INNER JOIN ".$table_authors." ta      ".
         "     ON ta.paper_id = tp.paper_id          ".
         "     INNER JOIN ".$table_subjects." ts     ".
         "     ON ts.paper_id = tp.paper_id          ".
         " );                                        ";

if ($debug) {
	echo $query;
	echo "<br /><br />";
}
if(! mysql_query($query) ) { die('Could not load into table: ' . mysql_error()); }
if ($debug) {
	echo "<br /><br />";
}
f_mysql_query("SELECT * FROM active_papers;");


// visualization specific queries

// for trend anlaysis
$query = " SELECT count_paper/count_tot_paper , selected.yr, selected.mn                                       ".
         "     FROM (                                                                                         ".
         "         SELECT count(p.paper_id) AS count_paper, year(dt_created) AS yr, month(dt_created) AS mn   ".
         "             FROM papers p                                                                          ".
         "             INNER JOIN active_papers ap                                                            ".
         "                 ON p.paper_id = ap.paper_id                                                        ".
         "                 GROUP BY yr, mn                                                                    ".
         "         ) selected                                                                                 ".
         "     INNER JOIN (                                                                                   ".
         "         SELECT count(paper_id) AS count_tot_paper, year(dt_created) AS yr, month(dt_created) AS mn ".
         "             FROM papers                                                                            ".
         "             GROUP BY year(dt_created), month(dt_created)) total                                    ".
         "     ON selected.yr = total.yr AND selected.mn = total.mn;                                          ";

$viz_ret_1 = f_mysql_query($query);
if ($debug) {
	echo $viz_ret_1;
	echo "<br /><br />";
}

// for subject graph
$query = " SELECT count(subject_name) AS count_sub, subject_name ".
         "     FROM subjects s                                   ".
         "     INNER JOIN active_papers ap                       ".
         "         ON ap.paper_id = s.paper_id                   ".
         "     GROUP BY s.subject_name                           ".
         "     ORDER BY count_sub DESC;                          ";

$viz_ret_2 = f_mysql_query($query);
if ($debug) {
	echo $viz_ret_2;
	echo "<br /><br />";
}

// for authors graph
$query = " SELECT a1.author_name AS author_1, a2.author_name AS author_2             ".
         "     FROM authors a1                                                       ".
         "     INNER JOIN active_papers ap                                           ".
         "         ON ap.paper_id = a1.paper_id                                      ".
         "     INNER JOIN authors a2                                                 ".
         "         ON a1.paper_id = a2.paper_id AND a1.author_name < a2.author_name; ";

$viz_ret_3 = f_mysql_query($query);
if ($debug) {
	echo $viz_ret_3;
	echo "<br /><br />";
}

// combining everthing together
$viz_ret_1 = json_decode($viz_ret_1, true); 
$viz_ret_2 = json_decode($viz_ret_2, true); 
$viz_ret_3 = json_decode($viz_ret_3, true); 

$master_ret = array('trending_data' => $viz_ret_1, 'subject_data' => $viz_ret_2, 'author_data' => $viz_ret_3);
echo json_encode($master_ret);

mysql_close($conn);

?>