const fs = require("fs");
const path = require("path");

function shape_dir(dirname, nameKey, keysToCopy, reducer = null) {
  let keys = {};
  let files = fs.readdirSync(path.join(__dirname, dirname));
  for (let filename of files) {
    if (filename.match(/^20.*?\.json$/)) {
      let buffer = fs.readFileSync(path.join(__dirname, dirname, filename));
      let data = JSON.parse(buffer);
      let date = `${filename.slice(0, 4)}-${filename.slice(
        4,
        6
      )}-${filename.slice(6, 8)}`;
      for (let datum of data) {
        if (!keys[datum[nameKey]]) {
          keys[datum[nameKey]] = {
            [nameKey]: datum[nameKey],
            data: [],
          };
        }

        let obj = { x: date };
        for (let key of keysToCopy) {
          if (reducer) {
            obj[key] = datum[key]?.[reducer];
          } else {
            obj[key] = datum[key];
          }
        }

        keys[datum[nameKey]].data.push(obj);
      }
    }
  }
  let out = JSON.stringify(Object.values(keys), null);
  fs.writeFileSync(path.join(__dirname, dirname, "all.json"), out);
}
// local
shape_dir("local", "name", [
  "active",
  "cases",
  "recovered",
  "deaths",
  "capita",
]);

// age
shape_dir("age", "category", [
  "male_cases",
  "male_percent",
  "female_cases",
  "female_percent",
  "unknown_cases",
  "unknown_percent",
  "all_cases",
  "percent",
]);

// severe
shape_dir("severe", "category", [
  "all_cases",
  "hospitalized",
  "hospitalized_pct",
  "hospitalized_rate",
  "icu",
  "icu_pct",
  "icu_rate",
  "deaths",
  "deaths_pct",
  "deaths_rate",
]);

// municipal
shape_dir("municipal", "name", ["active", "cases", "recovered", "deaths"]);

// ageVaccinatoins
shape_dir("ageVaccinations", "age_group", [
  "population",
  "dose_1",
  "dose_1_pct",
  "dose_2",
  "dose_2_pct",
  "dose_3",
  "total",
]);

shape_dir(
  "localVaccine",
  "place",
  ["75+", "60-74", "40-59", "20-39", "12-19", "12+", "All ages"],
  "count"
);
shape_dir("severeVaccine", "category", ["cases", "hospitalized", "deaths"]);
shape_dir("vaccineReactions", "category", ["count"]);
