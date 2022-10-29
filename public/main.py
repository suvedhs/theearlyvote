# open csv

# read through first county

# build json object

# keep going until next county

# at end, write json to file

# separate into election day voting and early voting

import csv
import json

countyinfo = {}

# county 0
# ppn 4567
# addy, time, etype

curcounty = ''
curLocs = []

with open('stategovt.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        elif line_count == 1:
            curcounty = row[0]
            print(curcounty)
            line_count += 1
        else:
            # print(f'\t{row[0]} and {row[4]}, {row[5]}, {row[6]}, {row[7]}')
            if curcounty == row[0]:
              curLocs.append({
                "POLL PLACE NAME": row[4],
                "ADDRESS": row[5],
                "POLLING PLACE TYPE": row[6],
                "DATE AND TIMINGS": row[7]
              })
            else:
              countyinfo[curcounty] = curLocs
              curcounty = row[0]
              curLocs = [
                {
                  "POLL PLACE NAME": row[4],
                  "ADDRESS": row[5],
                  "POLLING PLACE TYPE": row[6],
                  "DATE AND TIMINGS": row[7]
                }
              ]
            line_count += 1
    countyinfo[curcounty] = curLocs

json_object = json.dumps(countyinfo, indent=2)

# Writing to sample.json
with open("locations.json", "w") as outfile:
    outfile.write(json_object)


print(f'Processed {line_count} lines.')