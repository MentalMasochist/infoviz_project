infoviz_project
===============

Information Visualization Project


Notes
=====

ToDo
----

- [ ] Convert csv data in db -- SH
- [ ] move files into gitignored directory in website
- [ ] build website skeleton
	- [ ] forms
	- [ ] divs
	- [ ] css
- [ ] create php queries -- SH
- [ ] write js/html to get php queries -- RB
- [ ] sanity check queries
- [ ] add data to database csv python file to build section
	- [ ] add data section to website and put rwa data there
		- this will be good if you will continutally update the website database
- [ ] build out visualizations
	- [ ] trends
	- [ ] subject graph
	- [ ] author graph
	- [ ] word cloud
	- [ ] extra

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


