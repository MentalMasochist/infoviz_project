from sickle import Sickle
import datetime
from dateutil.relativedelta import relativedelta
import time
import csv


def get_ls_setSpec(sickle):
	sets = sickle.ListSets()
	ls_setSpec = [s.setSpec for s in sets]
	return ls_setSpec


def get_dt_last_harvest(fname_log):
	f_log = open(fname_log)
	dt_last_harvest = f_log.readlines()[-1].split(",")[0]
	return dt_last_harvest


def main():

	# inputs
	sleep_ct = 900  # number of records until seconds
	sleep_time = 30 # secs
	base_url = 'http://export.arxiv.org/oai2'
	fname_prefix = "./raw_data/arXiv_oai_dc_"
	fname_log = "./raw_data/harvest.log"

	# create sickle
	sickle = Sickle(base_url)

	# get list of setSpecs
	ls_setSpec = get_ls_setSpec(sickle)
	ct_sets = len(ls_setSpec)

	# read log file to get last harvest date
	dt_last_harvest = get_dt_last_harvest(fname_log)

	# append records
	ct_records = 0
	for setSpec in ls_setSpec:
		print setSpec
		# get data file
		fname_data = fname_prefix + setSpec.replace(":","_") + ".oai"
		f_data = open(fname_data,'a')
		# append records
		records = sickle.ListRecords(**{"metadataPrefix":"oai_dc", "set":setSpec, "from":dt_last_harvest}) 
		ct = 0
		for record in records:
			ct_records += 1
			f_data.write(str(record.metadata) + '\n')
			f_data.write(str(record.header) + '\n')
			if ct_records % sleep_ct == 0:
				print "sleep for %d secs" % (sleep_time)
				time.sleep(sleep_time)
		f_data.close()

	# log harvest
	logger = csv.writer(open(fname_log,'a'))
	dt_prev = dt_last_harvest
	dt_curr = datetime.datetime.today().date() - relativedelta(days=1)
	logger.writerow([dt_curr,dt_prev,ct_sets,ct_records]) 



if __name__ == "__main__":
	main()