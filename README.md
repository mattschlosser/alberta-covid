# COVID-19 analysis in Alberta, Canada

This is a data collection of active/recovered/deaths/total cases broken down by region per day. 

You can easily select each region and see the active/total/recovered/deaths for each region. 

Data is automatically updated daily, provided the Government of Alberta's dashboard updates on time. 
Some data are missing between Sept 15 and October 29, as I started this project on October 29, 
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

## Pull webpage

First, get a recent copy of the Alberta Covid data dashboard.

```
mkdir pages
cd pages
wget https://www.alberta.ca/stats/covid-19-alberta-statistics.htm
```

## Run various processors
```
node localProcessor.js
node ageProcessor.js
node severeProcessor.js
node municipalProcessor.js
```
Which produces a a 2020MMDD.json in the `local`, `age`, `severe` and `municipal` folders respectively,  where MM is the two digit month, and DD is the two digit date. The data is cureent up to the end of this date. 

### Formats

#### Local 
Each JSON file contains all of Alberta's geospatial data related to covid cases for that day. Each JSON file has the following format:
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
 }
]
```
#### Age
Each JSON file is an array of objects, one for each age category. Each category has a format like:
```json
{
  "category": "Under 1 Year", 
  "male_cases": 0, 
  "male_percent": 0, 
  "female_cases": 0, 
  "female_percent": 0,
  "unknown_cases": 0,
  "unknown_percent": 0, 
  "all_cases": 0, 
  "percent": 0
}
```

#### Severe Outcomes
Severe outcome JSON files are an array of objects, each
object representing an age category. Each category has a format like:
```json
{
  "category": "Under 1 year", 
  "all_cases": 2,
  "hospitalized": 0, 
  "hospitalized_pct": 0, 
  "hospitalized_rate": 0, 
  "icu": 0, 
  "icu_pct": 0, 
  "icu_rate": 0, 
  "deaths": 0, 
  "deaths_pct": 0, 
  "deaths_rate": 0
}
```

## Run the first aggregator
Run:
```
node data-shaper.js 
```
Which produces an `all.json` file, in local, age, and severe, each which contains all the data for each day

### Formats
Each `all.json` file is formated as a colleciton of time series data for each category/region.

#### Local

An array of objects. One for each region. Each region has a format like:
```json
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
    {
      "x": "2020-04-09", 
      "cases": 38, 
      "active": 24,
      "recovered": 13,
      "deaths": 1
    },
  ]
}
```
**Note:** There is a distinction between data before April 9, 2020, and onwards. Data before April 9 only includes total number of cases, whereas data after that date includes active cases, recoveries, and deaths. 

#### Age

The `all.json` file in the age folder is an array of objects, one for each age category. Each category has a format like:
```json
{
  "category": "Under 1 Year",
  "data": [
    {
      "x": "2020-03-21", 
      "male_cases": 0, 
      "male_percent": 0, 
      "female_cases": 0, 
      "female_percent": 0,
      "unknown_cases": 0,
      "unknown_percent": 0, 
      "all_cases": 0, 
      "percent": 0
    }, 
    { 
      "x": "2020-03-22", 
      "male_cases": 0, 
      "male_percent": 0, 
      "female_cases": 0, 
      "female_percent": 0,
      "unknown_cases": 0,
      "unknown_percent": 0, 
      "all_cases": 0, 
      "percent": 0
    }
  ]
}
```

#### Severe
The `all.json` file in the severe folder is an array of objects, one for each age category. Each category has a format like:
```json
{
  "category": "Under 1 Year",
  "data": [
    {
      "x": "2020-03-21", 
      "hospitalized": 0, 
      "hospitalized_pct": 0, 
      "hospitalized_rate": 0, 
      "icu": 0, 
      "icu_pct": 0, 
      "icu_rate": 0, 
      "deaths": 0, 
      "deaths_pct": 0, 
      "deaths_rate": 0
    }, 
    { 
      "x": "2020-03-22", 
      "hospitalized": 0, 
      "hospitalized_pct": 0, 
      "hospitalized_rate": 0, 
      "icu": 0, 
      "icu_pct": 0, 
      "icu_rate": 0, 
      "deaths": 0, 
      "deaths_pct": 0, 
      "deaths_rate": 0
    }
  ]
}
```

## Run the second aggregator
```
node data-shaper2.js
```
Which merges duplicate names into the same regions for local data, and places it in an `local/all2.json` file.  On August 16, 2020, some regions were renamed from names like "Calgary - Nose Hill" to "Calgary - Nose HIll (& Nearby Neighbourhoods)". This merges the data from older name formats, into the newer ones. 

## Run webpack
```
npm run webpack
```
This updates the files in `docs/` with the new data, which is where the GitHub Pages site is pointed. 

## Commit and push
```
git add . && git commit -m "Update for $(date)" && git push
```

# Frontend Dev 

To run a dev server for local dev of the UI pages

1. Install vue cli
```
npm i -g @vue/cli @vue/cli-service-global
```
2. Serve
```
vue serve ./src
```
