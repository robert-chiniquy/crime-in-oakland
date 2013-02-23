
all: process_opd_data
	echo "done"

opd_data:
	@[ -e data/OPD_PublicCrimeData_2007-12.csv ] ||\
		(wget http://data.openoakland.org/storage/f/2013-01-24T004002/OPD_PublicCrimeData_2007-12.csv.zip &&\
		unzip OPD_PublicCrimeData_2007-12.csv.zip) && echo "got opd data"

opd_police_beats:
	@[ -e data/Oak_PoliceBeats.shp ] ||\
		(wget http://data.openoakland.org/storage/f/2012-07-14T052144/Oak_CommunityPoliceBeats.zip &&\
		unzip Oak_CommunityPoliceBeats.zip) && echo "got police beat shapefile"

oakland_council_districts:
	@[ -e data/Oak_CityCouncilDistricts.shp ] ||\
		(wget http://data.openoakland.org/storage/f/2012-07-14T052946/Oak_CityCouncilDistricts.zip &&\
		unzip Oak_CityCouncilDistricts.zip) && echo "got council districts"

process_opd_data: opd_data
	./bin/load_opd.js


