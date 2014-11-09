-- Notes:
    -- when doing full text search, use boolean mode, 
    --   or it will only return at max 50% of the entire corpus


-- log in mysql
mysql -uroot -pe5ye5ye5y

-- log on with the permission to be able to load in
mysql -uroot --local-infile=1 -p

-- create database
CREATE DATABASE IF NOT EXISTS arXiv_db;

USE arXiv_db;

-- papers table

DROP TABLE IF EXISTS papers;

CREATE TABLE IF NOT EXISTS papers (
    paper_id VARCHAR(150) NOT NULL,
    title TEXT NOT NULL,
    dt_created DATE NOT NULL,
    set_spec VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (paper_id, set_spec)
);

ALTER TABLE papers ENGINE = MYISAM;


ALTER TABLE papers
    ADD FULLTEXT INDEX title_desc
    (title, description);

-- LOAD DATA LOCAL INFILE 'papers_test.csv'
LOAD DATA LOCAL INFILE 'papers.csv'
    INTO TABLE papers
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, title, dt_created, set_spec, description); 

-- authors table

DROP TABLE IF EXISTS authors;

CREATE TABLE IF NOT EXISTS authors (
    paper_id VARCHAR(150) NOT NULL,
    set_spec VARCHAR(40) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (paper_id, set_spec, author_name),
    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id)  
) ENGINE=MYISAM;

ALTER TABLE authors
    ADD FULLTEXT (author_name);

-- LOAD DATA LOCAL INFILE 'authors_test.csv'
LOAD DATA LOCAL INFILE 'proper_authors.csv'
    INTO TABLE authors
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, set_spec, author_name); 

-- subjects table
DROP TABLE IF EXISTS subjects;

CREATE TABLE IF NOT EXISTS subjects (
    paper_id VARCHAR(150) NOT NULL,
    set_spec VARCHAR(40) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (paper_id, set_spec, subject_name),
    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id)  
)ENGINE=MYISAM;

ALTER TABLE subjects
    ADD FULLTEXT (subject_name);

-- LOAD DATA LOCAL INFILE 'subjects_test.csv'
LOAD DATA LOCAL INFILE 'proper_subjects.csv'
    INTO TABLE subjects
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, set_spec, subject_name); 


------------------------
-- TABLE DESCRIPTIONS --
------------------------

-- mysql> describe papers;
-- +-------------+--------------+------+-----+---------+-------+
-- | Field       | Type         | Null | Key | Default | Extra |
-- +-------------+--------------+------+-----+---------+-------+
-- | paper_id    | varchar(100) | NO   | PRI | NULL    |       |
-- | title       | text         | NO   |     | NULL    |       |
-- | dt_created  | date         | NO   |     | NULL    |       |
-- | set_spec    | varchar(100) | NO   | PRI | NULL    |       |
-- | description | text         | NO   |     | NULL    |       |
-- +-------------+--------------+------+-----+---------+-------+


-- mysql> describe authors;
-- +-------------+--------------+------+-----+---------+-------+
-- | Field       | Type         | Null | Key | Default | Extra |
-- +-------------+--------------+------+-----+---------+-------+
-- | paper_id    | varchar(100) | NO   | PRI | NULL    |       |
-- | set_spec    | varchar(100) | NO   | PRI | NULL    |       |
-- | author_name | varchar(100) | NO   | PRI | NULL    |       |
-- +-------------+--------------+------+-----+---------+-------+
-- 3 rows in set (0.00 sec)


-- mysql> describe subjects;
-- +--------------+--------------+------+-----+---------+-------+
-- | Field        | Type         | Null | Key | Default | Extra |
-- +--------------+--------------+------+-----+---------+-------+
-- | paper_id     | varchar(100) | NO   | PRI | NULL    |       |
-- | set_spec     | varchar(100) | NO   | PRI | NULL    |       |
-- | subject_name | varchar(100) | NO   | PRI | NULL    |       |
-- +--------------+--------------+------+-----+---------+-------+

----------------
-- sanity checks
----------------

-- all tables should have the same number of distinct paper ids
---------------------------------------------------------------

-- check papers
SELECT COUNT(DISTINCT paper_id)
    FROM papers;

-- check authors
SELECT COUNT(DISTINCT paper_id)
    FROM authors;

-- check subjects
SELECT COUNT(DISTINCT paper_id)
    FROM subjects;


-- making queries
-----------------

-- idea: 
-- query each table given whether if each form is filled out
-- - get 3 temporary tables
--     1. t_papers
--     2. t_authors
--     3. t_subjects
-- - then inner join them to return the proper relation


-- Query 1
SELECT dt_created, count(dt_created) FROM papers
    WHERE MATCH (title, description) 
    AGAINST ('+tomorrow' IN BOOLEAN MODE)
    GROUP BY dt_created;

-- Query 2
    SELECT paper_id FROM authors
        WHERE CONTAINS (author_name, '"roughgarden*"');

    SELECT COUNT(*), paper_id, set_spec FROM authors
        WHERE MATCH (author_name) AGAINST ('roughgarden' IN BOOLEAN MODE)
        GROUP BY paper_id;

--------------------- 
-- inner join methods
---------------------
-- doesn't deal with multiple authors and subjects well (will give the union of )


SELECT s.paper_id, p.paper_id, s.paper_id
    FROM papers p
    INNER JOIN authors a
        ON p.paper_id = a.paper_id
    INNER JOIN subjects s
        ON p.paper_id = s.paper_id
    WHERE MATCH (a.author_name) AGAINST ('trimm' IN BOOLEAN MODE);

SELECT s.subject_name
    FROM papers p
    INNER JOIN authors a
        ON p.paper_id = a.paper_id
    INNER JOIN subjects s
        ON p.paper_id = s.paper_id
    WHERE MATCH (p.title, p.description) AGAINST ('+algorithm' IN BOOLEAN MODE)
    AND MATCH (a.author_name) AGAINST ('roughgarden' IN BOOLEAN MODE)
    AND MATCH (s.subject_name) AGAINST ('*theory*' IN BOOLEAN MODE);

---------------------------
-- three temp tables method 
---------------------------

-- papers
DROP TABLE IF EXISTS temp_papers;
CREATE TEMPORARY TABLE temp_papers AS (
    SELECT p.paper_id
        FROM papers p
        WHERE MATCH (p.title, p.description) AGAINST ('+"Seiberg-Witten"' IN BOOLEAN MODE)
);

-- authors
DROP TABLE IF EXISTS temp_authors;
CREATE TEMPORARY TABLE temp_authors AS (
SELECT a.paper_id
    FROM authors a
    WHERE MATCH (a.author_name) AGAINST ('trimm' IN BOOLEAN MODE)
    GROUP BY a.paper_id
    HAVING count(a.paper_id) = 1
);

-- subjects 
DROP TABLE IF EXISTS temp_subjects;
CREATE TEMPORARY TABLE temp_subjects AS (
SELECT s.paper_id
    FROM subjects s
    WHERE MATCH (s.subject_name) AGAINST ('HighEnergyPhysics-Theory' IN BOOLEAN MODE)
    GROUP BY s.paper_id
    HAVING count(s.paper_id) = 1
);


SELECT tp.paper_id
    FROM temp_papers tp
    INNER JOIN temp_authors ta 
    ON ta.paper_id = tp.paper_id
    INNER JOIN temp_subjects ts 
    ON ts.paper_id = tp.paper_id;

-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------

" -- papers                                                                                  ".
" DROP TABLE IF EXISTS temp_papers;                                                          ".
" CREATE TEMPORARY TABLE temp_papers AS (                                                    ".
"     SELECT p.paper_id                                                                      ".
"         FROM papers p                                                                      ".
"         WHERE MATCH (p.title, p.description) AGAINST (".$query_keywords." IN BOOLEAN MODE) ".
" );                                                                                         ".
"                                                                                            ".
" -- authors                                                                                 ".
" DROP TABLE IF EXISTS temp_authors;                                                         ".
" CREATE TEMPORARY TABLE temp_authors AS (                                                   ".
" SELECT a.paper_id                                                                          ".
"     FROM authors a                                                                         ".
"     WHERE MATCH (a.author_name) AGAINST (".$query_authors." IN BOOLEAN MODE)               ".
"     GROUP BY a.paper_id                                                                    ".
"     HAVING count(a.paper_id) = 1                                                           ".
" );                                                                                         ".
"                                                                                            ".
" -- subjects                                                                                ".
" DROP TABLE IF EXISTS temp_subjects;                                                        ".
" CREATE TEMPORARY TABLE temp_subjects AS (                                                  ".
" SELECT s.paper_id                                                                          ".
"     FROM subjects s                                                                        ".
"     WHERE MATCH (s.subject_name) AGAINST (".$query_subjects." IN BOOLEAN MODE)             ".
"     GROUP BY s.paper_id                                                                    ".
"     HAVING count(s.paper_id) = 1                                                           ".
" );                                                                                         ".
"                                                                                            ".
"                                                                                            ".
" SELECT tp.paper_id                                                                         ".
"     FROM temp_papers tp                                                                    ".
"     INNER JOIN temp_authors ta                                                             ".
"     ON ta.paper_id = tp.paper_id                                                           ".
"     INNER JOIN temp_subjects ts                                                            ".
"     ON ts.paper_id = tp.paper_id;                                                          ";

