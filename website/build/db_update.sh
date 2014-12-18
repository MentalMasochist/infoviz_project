#!/bin/bash
mysql -uroot --local-infile=1 < db_setup.sql;