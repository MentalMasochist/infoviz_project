infoviz_project
===============

Information Visualization Project


Notes
=====

- remember that frequency count needs to be normalized over all publications that year
	(the latter you can probably preprocess)
- an idea for any sujects that we can find is to just have a NULL subject that is attached to every paper


ToDo
----
- RB
	- [x] Finish data build
	- [x] Move SH queries to PHP
	- [x] Get php to reurn multiple Query results
	- [x] Send specific data to specific functions
	- [x] preprocessing -- need to get the dates to conform to d3 standard -- put as yyyy-mm-dd with zero fill
	- [x] Line Chart
- SH
	- [x] finishing up on queries
	- [x] remove \r characters from subject names
	- [ ] MSC mapping
	- [x] Insert space in subject names if needed
	- [not necc] normalization
    - [ ] bubble chart

- [ ] find all msc codes
- [ ] build out visualizations
	- [x] trends
	- [ ] subject graph
	- [ ] author graph
	- [not necc] word cloud
	- [not necc] extra

- [x] data preprocessing
	- [x] replace '\n' with spaces
	- [x] need to remove set spec and make paper_id by iteself to be unique
		- these are duplicate papers
	- [not necc] get the partition function for counts for each month and year already, so you dont have to do much for the last
		- find some way to do normalization fast for paper counts
	- [not necc] convert unique id into integer (the string part tells you nothing)
- [x] build website skeleton
	- [x] forms
	- [x] divs
	- [x] css
- [x] Convert csv data in db -- SH
- [x] remove set_spec as primary key
- [x] add data to database csv python file to build section
	- [x] add data section to website and put raw data there
		- this will be good if you will continutally update the website database
	- [x] need to include all cleaning files
		- sometimes there is a null field for authors that needs to be taken care of
- [x] move files into gitignored directory in website
- [x] sanity check queries

Queries
-------

- Should be the intersection of all form inputs
- if there is nothing or just white space in a form, do search with that input
 
Additional Notes/Concerns
-------------------------

- In description and title replace \\n with space
- some msc codes did not have mappings
- description and title have been cleaned
- how to deal with text encoding for non-english text?
- need to think how to parse author names so searches are intuitive?

Database Schema (bold fields are primary keys)
----------------------------------------------

- papers
	- __paper_id__ [VARCHAR(50)]
	- title [TEXT]
	- dt_created [DATE]
	- __set_spec__ [VARCHAR(50)]
	- description [TEXT]
- authors
	- __paper_id__ [VARCHAR(50)]
	- __set_spec__ [VARCHAR(50)]
	- __author_id__ [VARCHAR(50)]
- subjects
	- __paper_id__ [VARCHAR(50)]
	- __set_spec__ [VARCHAR(50)]
	- __subject_name__ [VARCHAR(50)]


Visualizations
--------------

- trend chart
	- annual looks god as a line, but the monthly is noisy (might need to be a scatter instead)
	- stick with just annual for right now


