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


- [ ] automated update of website data
	- [x] harvesting
	- [x] database update
	- [x] data preprocessing
	- [x] write script to create overview
		- [x] trend graph
		- [x] subject chart
	- [ ] set up master shell script file
		- order:
			1. harvest data from Arvix
			2. data preprocessing
			3. updated databases
			4. make trend overview data 
			5. make subject overview data
	- [ ] put master file in cron
- [ ] check box for normalization of trendline
	- maybe use radio button?
- [ ] see if you can add word cloud in somewhere
	- maybe top right corner (and trend line smaller)
- [ ] make trend line to be interactive for year selections
- [ ] when you contact Cornell, see if they have data for how many times a paper has been downloaded (or how many times a page has been clicked)
	- this will give a basis for ranking the papers
- [ ] see if you need a timeout error (need to start producing coded errors: i.e. return 999 for timeout)
- [ ] is there a way to multi-thread the queries on the php side? (I know you cant do this inside mysql for the engines present)
- [ ] figure out how to stop mysql on refresh (I have to do this with terminal now if I kill a query) 
- [ ] replace all code subjects with subject names

*Completed*
- [x] put an upper limit on the search return (50?)
- [x] redo video with new Author menu
- [x] replace overview Author viz with text

 
Additional Notes/Concerns
-------------------------

- how to deal with text encoding for non-english text?
