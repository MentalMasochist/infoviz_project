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
	- [ ] we should change click-queries to double click functions
	- [ ] do we need to limit the number o fauthors returned by the network graph
	- [ ] size encoding for author graph
	- [ ] querying 2 subjects doesn't seem to work appropriately
	- [ ] handle when Null query is returned
	- [ ] Add titles to graphs
	- [ ] create paper for instructors
	- [ ] see if you can click a button through javascript
	- [ ] check what search can be done with subject
	- [ ] need to handle edge cases
		- [ ] when there are no results found
		- [ ] opening webpage
				- use some static data here
	- [ ] graph titles
	- [x] subject mapping
	- [x] DB Query needs to use full name now 
	- [x] Finish data build
	- [x] Move SH queries to PHP
	- [x] Get php to reurn multiple Query results
	- [x] Send specific data to specific functions
	- [x] preprocessing -- need to get the dates to conform to d3 standard -- put as yyyy-mm-dd with zero fill
	- [x] Line Chart
	- [x] Author Chart
	- [x] multiple names is not intuitive
		- figure out how to only get Eward witten
		- would it be better to swtich the names to not be "lastname, firstname"?
	- [x] align svg's in each viz
	- [x] figure out a way to handle the author nework graph
	- [x] add thresholds to query

- SH
    - [x] subject chart
    	- what do the different color mean?
    	- can we figure out how to stuff more words into each bubble
    	and how to shut off words if the size is too small
    	- figure out how to show the count of papers of each subject to show for each bubble that we hover over? 
    	- do we need to separate sub-subjects and subjects?
    		- color code(and have legend) for subjects, and have bubbles for sub-subjects 
    			- need to make sure that bubbles of similar subject are tangent
	- [x] finishing up on queries
	- [x] remove \r characters from subject names
	- [x] Insert space in subject names if needed
	- [not necc] normalization
	- [not going to do] word cloud

- [ ] is there a way to multi-thread the queries on the php side? (I know you cant do this inside mysql for the engines present)
- [ ] need a time-out warning (need to start producing coded errors: i.e. return 999 for timeout)
- [ ] have normalization be an option
	- normalization makes sense on a large search basis, but not for looking at individuals (this will most surely always go down)
- [ ] figure out how to stop mysql on refresh (I have to do this with terminal now if I kill a query) 
- [ ] split visualizations and queries such that each viz loads when the data is ready (not sure if this is possible or if will cause a lot of extra work)
- [ ] sometimes the word "and" is in the author page -- need to remove this 
- [ ] apply a power function to collaboration graph such that the increase edge weight is magnified
- [ ] put limits on search based on either a top X or by paper count (i.e.\ importance)
- [ ] find all msc codes
- [ ] build out visualizations
	- [x] trends
	- [x] subject graph
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
	- set_spec [VARCHAR(50)]
	- description [TEXT]
- authors
	- __paper_id__ [VARCHAR(50)]
	- set_spec [VARCHAR(50)]
	- __author_id__ [VARCHAR(50)]
- subjects
	- __paper_id__ [VARCHAR(50)]
	- set_spec [VARCHAR(50)]
	- __subject_name__ [VARCHAR(50)]


Visualizations
--------------

- trend chart
	- annual looks god as a line, but the monthly is noisy (might need to be a scatter instead)
	- stick with just annual for right now


