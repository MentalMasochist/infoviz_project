\! echo "updating arXiv.org database... "

-- create database
CREATE DATABASE IF NOT EXISTS arXiv_db;

-- use db
USE arXiv_db;

-- papers table
\! echo "updating papers table... "
DROP TABLE IF EXISTS papers;

CREATE TABLE IF NOT EXISTS papers (
    paper_id VARCHAR(150) NOT NULL,
    hyperlink VARCHAR(150) NOT NULL,
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

LOAD DATA LOCAL INFILE './raw_data/papers.csv'
    INTO TABLE papers
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, hyperlink, title, dt_created, set_spec, description); 

-- authors table
\! echo "updating authors table... "
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

LOAD DATA LOCAL INFILE './raw_data/proper_authors.csv'
    INTO TABLE authors
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, set_spec, author_name); 

-- subjects table
\! echo "updating subjects table... "
DROP TABLE IF EXISTS subjects;

CREATE TABLE IF NOT EXISTS subjects (
    paper_id VARCHAR(150) NOT NULL,
    set_spec VARCHAR(40) NOT NULL,
    full_subject_name VARCHAR(100) NOT NULL,
    gen_subject_name VARCHAR(100) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (paper_id, full_subject_name),
    CONSTRAINT FOREIGN KEY (paper_id) REFERENCES papers (paper_id)  
)ENGINE=MYISAM;

ALTER TABLE subjects
    ADD FULLTEXT (full_subject_name);

LOAD DATA LOCAL INFILE './raw_data/proper_subjects.csv'
    INTO TABLE subjects
    FIELDS TERMINATED BY '\t'
    LINES TERMINATED BY '\n'
    (paper_id, set_spec, full_subject_name, gen_subject_name, subject_name); 