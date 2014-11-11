------------------------------
-- NOTES ---------------------
------------------------------

-- - when doing full text search, use boolean mode, or it 
--     will only return at max 50% of the entire corpus
-- 
-- 
-- 

------------------------------
-- DATABASE SET UP -----------
------------------------------

-- log on with the permission to be able to load in
mysql -uroot --local-infile=1 -p

-- create database
CREATE DATABASE IF NOT EXISTS arXiv_db;

-- use db
USE arXiv_db;

-- papers table
DROP TABLE IF EXISTS papers;

CREATE TABLE IF NOT EXISTS papers (
    paper_id VARCHAR(150) NOT NULL,
    title TEXT NOT NULL,
    dt_created DATE NOT NULL,
    set_spec VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (paper_id)
);

ALTER TABLE papers ENGINE = MYISAM;

ALTER TABLE papers
    ADD FULLTEXT INDEX title_desc
    (title, description);

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
    PRIMARY KEY (paper_id, author_name),
    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id)  
) ENGINE=MYISAM;

ALTER TABLE authors
    ADD FULLTEXT (author_name);

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
    PRIMARY KEY (paper_id, subject_name),
    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id)  
)ENGINE=MYISAM;

ALTER TABLE subjects
    ADD FULLTEXT (subject_name);

LOAD DATA LOCAL INFILE 'proper_subjects.csv'
    INTO TABLE subjects
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, set_spec, subject_name); 


------------------------------
-- TABLE DESCRIPTIONS --------
------------------------------

-- mysql> describe papers;
-- +-------------+--------------+------+-----+---------+-------+
-- | Field       | Type         | Null | Key | Default | Extra |
-- +-------------+--------------+------+-----+---------+-------+
-- | paper_id    | varchar(150) | NO   | PRI | NULL    |       |
-- | title       | text         | NO   | MUL | NULL    |       |
-- | dt_created  | date         | NO   |     | NULL    |       |
-- | set_spec    | varchar(40)  | NO   |     | NULL    |       |
-- | description | text         | NO   |     | NULL    |       |
-- +-------------+--------------+------+-----+---------+-------+


-- mysql> describe authors;
-- +-------------+--------------+------+-----+---------+-------+
-- | Field       | Type         | Null | Key | Default | Extra |
-- +-------------+--------------+------+-----+---------+-------+
-- | paper_id    | varchar(150) | NO   | PRI | NULL    |       |
-- | set_spec    | varchar(40)  | NO   |     | NULL    |       |
-- | author_name | varchar(100) | NO   | PRI | NULL    |       |
-- +-------------+--------------+------+-----+---------+-------+


-- mysql> describe subjects;
-- +--------------+--------------+------+-----+---------+-------+
-- | Field        | Type         | Null | Key | Default | Extra |
-- +--------------+--------------+------+-----+---------+-------+
-- | paper_id     | varchar(150) | NO   | PRI | NULL    |       |
-- | set_spec     | varchar(40)  | NO   |     | NULL    |       |
-- | subject_name | varchar(100) | NO   | PRI | NULL    |       |
-- +--------------+--------------+------+-----+---------+-------+

------------------------------
-- SANITY CHECKS -------------
------------------------------

-- all tables should have the same number of distinct paper ids
SELECT COUNT(paper_id)
FROM papers;

SELECT COUNT(paper_id)
FROM authors;

SELECT COUNT(paper_id)
FROM keywords;

--------------------
-- making queries --
--------------------

-- idea: 
-- query each table given whether if each form is filled out
-- - get 3 temporary tables
--     1. t_papers
--     2. t_authors
--     3. t_subjects
-- - then inner join them to return the proper relation


------------------------------
-- TEST QUERIES --------------
------------------------------

--
SELECT dt_created, count(dt_created) FROM papers
    WHERE MATCH (title, description) 
    AGAINST ('+tomorrow' IN BOOLEAN MODE)
    GROUP BY dt_created;

--
SELECT paper_id FROM authors
    WHERE CONTAINS (author_name, '"roughgarden*"');

--
SELECT COUNT(*), paper_id, set_spec FROM authors
    WHERE MATCH (author_name) AGAINST ('roughgarden' IN BOOLEAN MODE)
    GROUP BY paper_id;

------------------------------
-- QUERIES USED --------------
------------------------------

-- TEMPORARY TABLE METHOD
-------------------------

--
-- creating temporary tables
--

-- papers temp table
DROP TABLE IF EXISTS temp_papers;
CREATE TEMPORARY TABLE temp_papers AS (
    SELECT p.paper_id
        FROM papers p
        WHERE MATCH (p.title, p.description) AGAINST (' ' IN BOOLEAN MODE)
);

-- authors temp table
DROP TABLE IF EXISTS temp_authors;
CREATE TEMPORARY TABLE temp_authors AS (
SELECT a.paper_id
    FROM authors a
    WHERE MATCH (a.author_name) AGAINST ('Trimm' IN BOOLEAN MODE)
    GROUP BY a.paper_id
    HAVING count(a.paper_id) = 1
);

-- subjects table
DROP TABLE IF EXISTS temp_subjects;
CREATE TEMPORARY TABLE temp_subjects AS (
SELECT s.paper_id
    FROM subjects s
    WHERE MATCH (s.subject_name) AGAINST ('HighEnergyPhysics-Theory' IN BOOLEAN MODE)
    GROUP BY s.paper_id
    HAVING count(s.paper_id) = 1
);

-- 
-- combine into temporary table
-- 

-- combine temporary tables into an active table set
DROP TABLE IF EXISTS active_papers;
CREATE TEMPORARY TABLE active_papers AS (
SELECT DISTINCT tp.paper_id
    FROM temp_papers tp
    INNER JOIN temp_authors ta 
    ON ta.paper_id = tp.paper_id
    INNER JOIN temp_subjects ts 
    ON ts.paper_id = tp.paper_id
);


-- 
-- visualization specific queries
-- 

-- TREND GRAPH
SELECT count_paper/count_tot_paper, selected.yr, selected.mn 
    FROM (
        SELECT count(p.paper_id) AS count_paper, year(dt_created) AS yr, month(dt_created) AS mn 
            FROM papers p 
            INNER JOIN active_papers ap 
                ON p.paper_id = ap.paper_id 
                GROUP BY yr, mn
        ) selected 
    INNER JOIN (
        SELECT count(paper_id) AS count_tot_paper, year(dt_created) AS yr, month(dt_created) AS mn 
            FROM papers 
            GROUP BY year(dt_created), month(dt_created)) total 
    ON selected.yr = total.yr AND selected.mn = total.mn;


-- SUBJECT GRAPH
SELECT count(subject_name) AS count_sub, subject_name 
    FROM subjects s 
    INNER JOIN active_papers ap 
        ON ap.paper_id = s.paper_id 
    GROUP BY s.subject_name
    ORDER BY count_sub DESC;


-- AUTHOR COLLOBORATION
SELECT a1.author_name, a2.author_name   
    FROM authors a1 
    INNER JOIN active_papers ap 
        ON ap.paper_id = a1.paper_id 
    INNER JOIN authors a2
        ON a1.paper_id = a2.paper_id AND a1.author_name < a2.author_name;


------------------------------
-- SANITY CHECKS -------------
------------------------------

-- -- 1
-- -- Desc: temporary tables join to form correct query
-- -- Assertion: The following search should return 1 paper

-- papers temp table
DROP TABLE IF EXISTS temp_papers;
CREATE TEMPORARY TABLE temp_papers AS (
    SELECT p.paper_id
        FROM papers p
        WHERE MATCH (p.title, p.description) AGAINST ('Seiberg-Witten' IN BOOLEAN MODE)
);


-- authors temp table
DROP TABLE IF EXISTS temp_authors;
CREATE TEMPORARY TABLE temp_authors AS (
SELECT a.paper_id
    FROM authors a
    WHERE MATCH (a.author_name) AGAINST ('Trimm' IN BOOLEAN MODE)
    GROUP BY a.paper_id
    HAVING count(a.paper_id) = 1
);

-- subjects table
DROP TABLE IF EXISTS temp_subjects;
CREATE TEMPORARY TABLE temp_subjects AS (
SELECT s.paper_id
    FROM subjects s
    WHERE MATCH (s.subject_name) AGAINST ('HighEnergyPhysics-Theory' IN BOOLEAN MODE)
    GROUP BY s.paper_id
    HAVING count(s.paper_id) = 1
);

SELECT DISTINCT count(tp.paper_id)
    FROM temp_papers tp
    INNER JOIN temp_authors ta 
        ON ta.paper_id = tp.paper_id
    INNER JOIN temp_subjects ts 
        ON ts.paper_id = tp.paper_id;


-- -- 2
-- -- Test: Author Collaboration returns the correct number of results 
-- -- Assertion: should return 6 edges
-- -- 
-- -- NOTE: If we are going to weight each author, if there are n authors present, we should assign a weight of 1/(n-1) for each author for each paper
-- --       This way, having more authors doesn't accidentally increase the weight of each author in that graph
-- -- 

DROP TABLE IF EXISTS temp_papers;
CREATE TEMPORARY TABLE temp_papers AS (
    SELECT p.paper_id
        FROM papers p
        WHERE paper_id = "oai:arXiv.org:0704.0109"
);

-- combine temporary tables into an active table set
DROP TABLE IF EXISTS active_papers;
CREATE TEMPORARY TABLE active_papers AS (
SELECT DISTINCT tp.paper_id
    FROM temp_papers tp
    INNER JOIN authors ta 
    ON ta.paper_id = tp.paper_id
    INNER JOIN subjects ts 
    ON ts.paper_id = tp.paper_id
);

-- AUTHOR COLLOBORATION
SELECT a1.author_name, a2.author_name 
    FROM authors a1 
    INNER JOIN active_papers ap 
        ON ap.paper_id = a1.paper_id 
    INNER JOIN authors a2
        ON a1.paper_id = a2.paper_id AND a1.author_name < a2.author_name;

-- -- 3
-- -- Test: Author Collaboration returns the correct number of 
-- -- Assertion: should return 2 values, each of count 1
-- -- 

DROP TABLE IF EXISTS temp_papers;
CREATE TEMPORARY TABLE temp_papers AS (
    SELECT p.paper_id
        FROM papers p
        WHERE paper_id = "oai:arXiv.org:0704.0109"
);

-- combine temporary tables into an active table set
DROP TABLE IF EXISTS active_papers;
CREATE TEMPORARY TABLE active_papers AS (
SELECT DISTINCT tp.paper_id
    FROM temp_papers tp
    INNER JOIN authors ta 
    ON ta.paper_id = tp.paper_id
    INNER JOIN subjects ts 
    ON ts.paper_id = tp.paper_id
);

-- SUBJECT GRAPH
SELECT count(subject_name) AS count_sub, subject_name 
    FROM subjects s 
    INNER JOIN active_papers ap 
        ON ap.paper_id = s.paper_id 
    GROUP BY s.subject_name
    ORDER BY count_sub DESC;
