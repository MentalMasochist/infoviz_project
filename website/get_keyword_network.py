from nltk import word_tokenize
from nltk.util import ngrams
import csv
from nltk.stem.lancaster import LancasterStemmer
import nltk
from collections import Counter
import json
import sys
#reader = csv.reader(open('papers.csv', 'rb'), delimiter = '\t')
#word = 'algorithm'

#writer = csv.writer(open('keyword_count_algorithm.csv', 'wb'), delimiter = '\t')
#writer.writerow(['Keyword', 'Count'])


with open(sys.argv[1]) as json_file:
	json_data = json.load(json_file)

all_words = []
stemmer = LancasterStemmer()
for row in json_data:
	data = row['des']
	tokens = [x.lower() for x in nltk.word_tokenize(data)]
	flag = [x for x in tokens if word in x]

	if len(flag) >= 1:
		words = []
		tags = nltk.pos_tag(tokens)
		for t in tags:
			if t[1] == 'NN':
				words.append(stemmer.stem(t[0]))
			if t[1] == 'NNS':
				words.append(stemmer.stem(t[0]))
		all_words.append(words)

word_count = Counter()

for words in all_words:
	for w in words:
		word_count[w] += 1

####Need to write to json file or in some appropriate format and return!!!



	

	

