import glob
import csv
import ast
import xml.etree.ElementTree as ET

def move_all():
    raw_file_list = glob.glob('./raw_data/*.oai')
    fout = csv.writer(open("./raw_data/master.oai",'wb'), delimiter='\t')
    print "files processed:"
    for filename in raw_file_list:
        if "master.oai" in filename :
            continue
        print "    ",filename
        fin = open(filename,'rb')        
        ct = 0 
        for line in fin:
            if ct % 2 == 0:
                d_line = ast.literal_eval(line)
            else:
                paperID = setSpec = line.split('</identifier>')[0].split('<identifier>')[-1]
                d_line['paperID'] = paperID 
                setSpec = line.split('</setSpec>')[0].split('<setSpec>')[-1]
                d_line['setSpec'] = setSpec 
                fout.writerow([str(d_line)])
            ct += 1
        fin.close()

def create_db_files():
    # file names
    master_filename = "./raw_data/master.oai"
    db_papers_fname = "./raw_data/papers.csv"
    db_authors_fname = "./raw_data/proper_authors.csv"
    db_subjects_fname = "./raw_data/proper_subjects.csv"
    
    # create files
    f_master = csv.reader(open(master_filename, 'rb'), delimiter='\t')
    wtr_papers = csv.writer(open(db_papers_fname,'wb'), delimiter='\t')
    wtr_subjects = csv.writer(open(db_subjects_fname,'wb'), delimiter='\t')
    wtr_authors = csv.writer(open(db_authors_fname,'wb'), delimiter='\t')
    # write into files
    ct = 0
    for line in f_master:
        ct += 1
        if ct % 10000 == 0:
            print ct
        # conver to dict
        d_line = ast.literal_eval(line[0])
        # papers table
        paper_id = d_line['paperID']
        title =  d_line['title'][0].replace('\n', ' ')
        title = title.replace('\r','')
        dt_created = d_line['date'][0]
        set_spec = d_line['setSpec']
        description = d_line['description'][0].replace('\n', ' ')
        description = description.replace('\r','')
        wtr_papers.writerow([paper_id, title.encode('utf8'), dt_created, set_spec, description.encode('utf8')])
        # authors table
        for author in d_line['creator']:
            if not any(c.isalpha() for c in author):
                continue
            author_parts = author.split(',')
            if len(author_parts) == 2:
                author_parts = author_parts
                author = author_parts[1].strip() + " " + author_parts[0].strip()                
            if len(author_parts) == 3:
                author_parts = author_parts
                author = author_parts[2].strip() + " " + author_parts[0].strip() + " " + author_parts[1].strip()
            if len(author_parts) > 4:
                # nothing appears to be in this region, print in case there is
                print "strange commas for author: ", author  
            wtr_authors.writerow([paper_id, set_spec, author.encode('utf8')])
        # subjects table
        for subject in d_line['subject']:
            #print subject
            try:
                string = ''
                prev = 0
                sub = subject.encode('utf8')
                flag = any(char.isdigit() for char in sub)
                if flag is False:
                    for i0, i in enumerate(sub):
                        if i.isupper():
                            if prev != 0:
                                string += ' ' + sub[prev:i0]
                            else:
                                string += sub[prev:i0]
                            prev = i0
                    if prev != 0:
                        string += ' '+sub[prev:len(sub)]
                    else:
                        string += sub[prev:len(sub)]
                    #print string
                    wtr_subjects.writerow([paper_id, set_spec, string])
                else:
                    wtr_subjects.writerow([paper_id, set_spec, sub])
            except:
                print d_line['subject']


if __name__ == "__main__":
    # move_all()
    # print "\nharvested files moved to master.oai\n"
    create_db_files()
    print "\ndb read csv files complete\n"