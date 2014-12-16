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
- [ ] replace overview Author viz with text
- [ ] redo video with new Author menu
- [ ] check box for normalization of trendline
	- maybe use radio button?
- [ ] see if you can add word cloud in somewhere
- [ ] see if you need a timeout error (need to start producing coded errors: i.e. return 999 for timeout)
- [ ] when you caontact Cornell, see if they have data for how many times a paper has been downloaded (or how many times a page has been clicked)
	- this will give a basis for ranking the papers
- [ ] is there a way to multi-thread the queries on the php side? (I know you cant do this inside mysql for the engines present)
- [ ] figure out how to stop mysql on refresh (I have to do this with terminal now if I kill a query) 
- [ ] put an upper limit on the search return (50?)
- [ ] replace all code subjects with subject names

 
Additional Notes/Concerns
-------------------------

- In description and title replace \\n with space
- some msc codes did not have mappings
- description and title have been cleaned
- how to deal with text encoding for non-english text?
- need to think how to parse author names so searches are intuitive?