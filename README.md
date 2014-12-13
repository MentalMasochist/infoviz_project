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
- [ ] when you caontact Cornell, see if they have data for how many times a paper has been downloaded (or how many times a page has been clicked)
	- this will give a basis for ranking the papers
- [ ] check what search can be done with subject
- [ ] need to handle edge cases
	- [ ] when there are no results found
	- [ ] opening webpage
			- use some static data here
	- [ ] graph titles

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

 
Additional Notes/Concerns
-------------------------

- In description and title replace \\n with space
- some msc codes did not have mappings
- description and title have been cleaned
- how to deal with text encoding for non-english text?
- need to think how to parse author names so searches are intuitive?