#!/bin/sh
# First run
mkdir -p pages/
mkdir -p summary/
echo "Downlaoding Historical Data"
node scraper.js
echo "Download complete"

# Download Dashboard
wget https://www.alberta.ca/stats/covid-19-alberta-statistics.htm && \
mv *.htm pages/$(date '+%Y%m%d%H%M%S').htm

# Download Summary
wget https://www.alberta.ca/covid-19-alberta-data.aspx && \
mv *.aspx summary/$(date '+%Y%m%d%H%M%S').aspx

# Extract Data
node localProcessor.js && \
node topProcessor.js && \
node variantProcessor.js && \
node vaccineProcessor.js && \
node municipalProcessor.js && \
node ageProcessor.js && \
node severeProcessor.js && \
node ageVaccineProcessor.js && \
node localVaccineProcessor.js && \
node severeVaccineProcessor.js && \
node diffProcessor.js && \
node data-shaper.js && \
node data-shaper2.js && \
node allProcessor.js
# Build and push
npm run webpack && \
git add . && \
git commit -m "Update for $(date)" && \
git push
