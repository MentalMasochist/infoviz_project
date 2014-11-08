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

// drop papers table
$sql = "DROP TABLE IF EXISTS arXiv_db.papers";
$retval = mysql_query( $sql );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - papers table dropped successfully <br />";

// create papers table
$sql = "CREATE TABLE IF NOT EXISTS papers (    ".
       "    paper_id VARCHAR(150) NOT NULL,    ".
       "    title TEXT NOT NULL,               ".
       "    dt_created DATE NOT NULL,          ".
       "    set_spec VARCHAR(40) NOT NULL,     ".
       "    description TEXT NOT NULL,         ".
       "    PRIMARY KEY (paper_id, set_spec)); ";

$retval = mysql_query( $sql );

if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - papers table created successfully <br />";

// alter table engine to MYISAM
$retval = mysql_query( $sql );
$sql = "ALTER TABLE papers ENGINE = MYISAM;";

if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - papers table engine altered <br />";


// alter table to be full text
$sql = " ALTER TABLE papers                ".
       "     ADD FULLTEXT INDEX title_desc ".
       "     (title, description);         ";

$retval = mysql_query( $sql );

if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - papers table full text incorporated <br />";


// drop authors table
$sql = "DROP TABLE IF EXISTS arXiv_db.authors";
$retval = mysql_query( $sql );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - authors table dropped successfully <br />";


// create authors table
$sql = " CREATE TABLE IF NOT EXISTS authors (                               ".
       "     paper_id VARCHAR(150) NOT NULL,                                ".
       "     set_spec VARCHAR(40) NOT NULL,                                 ".
       "     author_name VARCHAR(100) NOT NULL,                             ".
       "     PRIMARY KEY (paper_id, set_spec, author_name),                 ".
       "     CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id) ".
       " ) ENGINE=MYISAM;                                                   ";
$retval = mysql_query( $sql );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - authors table created successfully <br />";


// drop sujects table
$sql = "DROP TABLE IF EXISTS arXiv_db.subjects";
$retval = mysql_query( $sql );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - subjects table dropped successfully <br />";


// create subjects table
$sql = "CREATE TABLE IF NOT EXISTS subjects (                              ".
       "    paper_id VARCHAR(150) NOT NULL,                                ".
       "    set_spec VARCHAR(40) NOT NULL,                                 ".
       "    subject_name VARCHAR(100) NOT NULL,                            ".
       "    PRIMARY KEY (paper_id, set_spec, subject_name),                ".
       "    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id) ".
       ")ENGINE=MYISAM;                                                    ";

$retval = mysql_query( $sql );
if(! $retval )
{
  die('Could not create table: ' . mysql_error());
}
echo " - subjects table created successfully <br />";
mysql_close( $server );
?>