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
                print
                print line
                paperID = setSpec = line.split('</identifier>')[0].split('<identifier>')[-1]
                print paperID
                d_line['paperID'] = paperID 
                setSpec = line.split('</setSpec>')[0].split('<setSpec>')[-1]
                print setSpec
                exit()
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
        # conver to dict
        d_line = ast.literal_eval(line[0])
        # papers table
        paper_id = d_line['paperID']
        title =  d_line['title'][0].replace('\n', ' ')
        dt_created = d_line['date'][0]
        set_spec = d_line['setSpec']
        description = d_line['description'][0].replace('\n', ' ')
        wtr_papers.writerow([paper_id, title.encode('utf8'), dt_created, set_spec, description.encode('utf8')])
        # authors table
        for author in d_line['creator']:
            wtr_authors.writerow([paper_id, set_spec, author.encode('utf8')])
        # subjects table
        for subject in d_line['subject']:
            try:
                wtr_subjects.writerow([paper_id, set_spec, subject.encode('utf8')])    
            except:
                print d_line['subject']


if __name__ == "__main__":
    # move_all()
    # print "\nharvested files moved to master.oai\n"
    create_db_files()
    print "\ndb read csv files complete\n"