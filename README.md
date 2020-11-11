# COVID-19 analysis in Alberta, Canada

This is a data collection of active/recovered/deaths/total cases broken down by region per day. 

You can easily select each region and see the active/total/recovered/deaths for each region. 

Data is automatically updated daily, provided the Government of Alberta's dasboard updates on time. 
Some datapoints are missing between Sept 15 and October 29, as I started this project on October 29, 
and while the majority of data was available by pulling from web.archive.org, few archived copies of
the dashbaord exist between Sept. 15 and October 29. 

# Pipeline

1. Pull webpage

```
wget https://www.alberta.ca/stats/covid-19-alberta-statistics.htm
```

2. Run html processor
```
node htmlProcessor.js
```
Which produces a 20MMDD.json file where MM is the two digit month, and DD is the two digit date

3. Run JSON processor
```
node .
```
Which extracts just the data we need, and places it in a 2020MMDD.json file

4. Move JSON file to local directory
``` 
mv 2020* local/
```

5. Clean up files
```
rm covid* 20* 
```

6. Run the first aggregator
```
node data-shaper.js 
```
Which produces an `all.json` file, which contains all the data for each day

7. Run the second aggregator
```
node data-shaper2.js
```
Which merges duplicate names into the same regions

8. Move file to correct location
```
mv all2.json local/
```

9. Run webpack
```
npm run webpack
```

10. Commit and push
```
git add . && git commit -m "Update for $(date)" && git push
```
