# COVID-19 Date Dashboard for Alberta, Canada

This is a data collection of various data of interest related to CoViD-19 in Alberta. It includes active, recovered, and total cases of the disease, as well as total deaths caused by it. It also includes the geographical distribution of cases, broken down by region per day. 

An interactive dashboard to explore the data is available at https://covid.mattschlosser.me.
You can select a region and see the active/total/recovered/deaths for each region. 

Data is automatically updated daily, provided the Government of Alberta's dashboard updates on time (usually around 3:35 pm)

The dashboard contains various charts including:
* History of all cases, active, recovered, and daeths.
* History of cases counts devided by local geographical (neighbourhood) or municipal area.
* History of hospitalizations, ICU, and deaths rates, by age.
* History of age/gender distribution of cases. 
* History of CoViD-19 variants in Alberta, broken down by region.
* Total vaccines administered as of each day

# Developing 

```
git clone https://github.com/mattschlosser/alberta-covid
cd alberta-covid
npm install
````

# Pipeline

This is how to update the data/what each script is for. 

A simple script is provided to update the data. 

On Ubuntu/WSL/Linux:
```sh
./update.sh
```

Below are the various scripts that `update.sh` does:

## Pull webpage

First, get a recent copy of the Alberta Covid data dashboard.

```
mkdir pages
cd pages
wget https://www.alberta.ca/stats/covid-19-alberta-statistics.htm
```

## Run various processors

### Historical Processors

#### Per-Day Files

```
node localProcessor.js
node ageProcessor.js
node severeProcessor.js
node municipalProcessor.js
```
Each of these produces a 2020MMDD.json in the `local`, `age`, `severe` and `municipal` folders respectively,  where MM is the two digit month, and DD is the two digit date. Data is pulled from each pae in the `pages/` directory. Dates that already have been processed are skipped.  The data in each dated file is cureent up to the end of it's date. 

#### Aggregate Files
```
node topProcessor.js
node variantProcessor.js
```
Each of these produce a single file in the data directory. 

`topProcessor.js` processes the tiles from the Alberta dashboard at 
https://covid19stats.alberta.ca. This produces a file, `data/dailyCaseCounts.json`, which is the summary of # of people in hospital (both ICU and non-ICU cases) per day, current active cases, and total deaths. 

`variantProcessor.js` processes the variant table found at https://alberta.ca/covid19.


### Formats

#### Vaccine Rollout
In [`/data/dailyVaccineCounts.json`](data/dailyVaccineCounts.json), the form is as follows:
```json
[
  {
    "Vaccines": {
      "data": [
        { "x": "2021-02-02", "Doses": 123000}, 
        { "x": "2021-02-03", "Doses": 125000}, 
        // ...
      ]
    }
  }
]
```


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
[Severe outcome JSON files](severe/) are an array of objects, each
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
Which produces an `all.json` file, in [local](local/all.json), [age](age/all.json), and [severe](severe/all.json), each which contains all the data for each day

### Formats
Each `all.json`, as well as each of the files in the `data` dir, is formated as a colleciton of time series data for each category/region.

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

The [`all.json` file in the age folder](age/all.json) is an array of objects, one for each age category. Each category has a format like:
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
The [`all.json` file in the severe folder](severe/all.json) is an array of objects, one for each age category. Each category has a format like:
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

#### [data/dailyCaseCounts.json](data/dailyCaseCounts.json)

Only one category, "Alberta" with the names and values of the six tiles for each date. 
*Note:* The content of the six tiles have not all been consistent. While `active cases`, `current ICU`, 
`current hospitalisations` and `total deaths` have always been present, the other keys/values to the other 
tiles may change from day to day.

```json
[{
  "category": "Alberta", 
  "data": [
    {
      "x": "2020-06-18",
      "current hospitalizations": 38, 
      "current ICU": 6, 
      "active cases" : 525, 
      "total deaths": 152
    }
  ]
}]
```

#### [data/dailyVariantCounts.json](data/dailyVariantCounts.json)

There are six categories in this file: `In Alberta`, `Edmonton Zone`, `Calgary Zone`, `North Zone`, `South Zone`, and `Central Zone`. Each category contains array of objects, one for each date, and the keys `total`, `B.1.1.7`, and `B.1.351`, whose values are the respective case counts in each category for that date. 

```json
[{
  "category": "In Alberta", 
  "data": [
    {
      "x": "2021-02-09",
      "B.1.1.7": 97,
      "B.1.351": 7, 
      "total" : 104
    }
  ]
}]
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
