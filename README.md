# COVID-19 analysis in Alberta, Canada

This is a data collection of active/recovered/deaths/total cases broken down by region per day. 

You can easily select each region and see the active/total/recovered/deaths for each region. 

Data is automatically updated daily, provided the Government of Alberta's dasboard updates on time. 
Some datapoints are missing between Sept 15 and October 29, as I started this project on October 29, 
and while the majority of data was available by pulling from web.archive.org, few archived copies of
the dashbaord exist between Sept. 15 and October 29. 

# Developing 

```
git clone https://github.com/mattschlosser/alberta-covid
cd alberta-covid
npm install
````

# Pipeline

This is how to update the data/what each script is for. 

1. Pull webpage

Get a recent copy of the Alberta Covid data dashboard.

```
wget https://www.alberta.ca/stats/covid-19-alberta-statistics.htm
```

2. Run html processor
```
node htmlProcessor.js
```
Which produces a 20MMDD.json file where MM is the two digit month, and DD is the two digit date. The data is cureent up to the end of this date. This JSON file contains all of Alberta's geospatial data related to covid cases for that day.

3. Run JSON processor
```
node .
```
This extracts the daily case numbers for each region, and places it in a 2020MMDD.json file, formatted as such:

This JOSN file looks something like...
```json
[
 { 
   "name": "Region Name Here", 
   "cases": 3, 
   "recovered": 1, 
   "deaths": 1, 
   "active": 1
 },
 { 
   "name" : "Another Region Here", 
   "cases": 3, 
   "recovered": 1, 
   "deaths": 1, 
   "active": 1
 },
 ...
]
```

4. Move JSON file to local directory 
``` 
mv 2020* local/
```

5. Clean up files no longer needed.
```
rm covid* 20* 
```

6. Run the first aggregator
```
node data-shaper.js 
```
Which produces an `all.json` file, which contains all the data for each day

```json
[
  {
    "name": "Calgary - West",
    "data": [
      {
        "x": "2020-03-21", 
        "cases": 0, 
      }, 
      { 
        "x": "2020-03-22", 
        "cases": 1,
      },
      ...,
      {
        "x": "2020-04-09", 
        "cases": 38, 
        "active": 24,
        "recovered": 13,
        "deaths": 1
      },
      ...
    ]
  },
  ...
]
```
**Note:** There is a distinction between data before April 9, 2020, and onwards. Data before April 9 only includes total number of cases, whereas data after that date includes active cases, recoveries, and deaths. 

7. Run the second aggregator
```
node data-shaper2.js
```
Which merges duplicate names into the same regions.  On August 16, 2020, some regions were renamed from names like "Calgary - Node Hill" to "Calgary - Nose HIll (& Nearby Neighbourhoods)". This merges the data from older name formats, into the newer ones. 

8. Run webpack
```
npm run webpack
```
This updates the files in `/docs` with the new data, which is where the GitHub Pages site is pointed. 

9. Commit and push
```
git add . && git commit -m "Update for $(date)" && git push
```
