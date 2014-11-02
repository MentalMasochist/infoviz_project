infoviz_project
===============

Information Visualization Project


Notes
=====

Database Schema (bold fields are primary keys)
----------------------------------------------

- papers
	- __paper_id__
	- title
	- dt_created
	- __set_spec__
	- description
- authors
	- __paper_id__
	- __set_spec__
	- __author_id__
- subjects
	- __paper_id__
	- __set_spec__
	- __subject_name__
