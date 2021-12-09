const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const { make_date_from_regex_match } = require("./lib/utils");

let files = fs.readdirSync(path.join(__dirname, "summary"));

let keyedFinal = {
  "In Alberta": {
    name: "In Alberta",
    data: [],
  },
};

let keyedOtherFinal = {
  // 'Alberta'
};

let f = (n) =>
  n
    .split(/\s/)[0]
    .split(",")
    .join("");
let g = (n) => f(n.split(/\r|\n/).join(""));
let done = {
  "In Alberta": {},
};
let otherDone = {};
for (let filename of files) {
  if (filename.match(/\.aspx/)) {
    let data = fs.readFileSync(path.join(__dirname, "summary", filename));
    let file = parse(data);
    c = file.querySelectorAll("#goa-grid34045");
    // pull the date from the paragraph
    date = c[0].text.match(/As of ([A-Z][a-z]*) (\d\d?)/);
    let all = keyedFinal["In Alberta"].data;
    if (date) {
      let e = [...file.querySelectorAll("#goa-grid34045 li")];
      let b117 = +e[0].text.split(/\s/)[0];
      let b1351 = +e[1].text.split(/\s/)[0];
      let niceDate = make_date_from_regex_match(date);
      if (!done[niceDate]) {
        let d = {
          x: niceDate,
          "B.1.1.7": b117,
          "B.1.351": b1351,
          total: b117 + b1351,
        };
        all.push(d);
        done[niceDate] = true;
      }
    } else {
      // we will assume the variants
      let table = file.querySelectorAll(".goa-table")[1];
      if (!table) break;
      rows = table.querySelectorAll("tr");
      rows.splice(0, 1);
      rows.forEach((row) => {
        let zone = row.querySelector("th").text;
        let nums = row.querySelectorAll("td");
        if (!keyedFinal[zone]) {
          keyedFinal[zone] = {
            name: zone,
            data: [],
          };
          done[zone] = {};
        }
        let date = table
          .querySelector("em")
          .text.match(/Table updated ([A-Z][a-z]*?\.?) (\d{1,2})/);

        let niceDate = make_date_from_regex_match(date);
        if (!done[zone][niceDate]) {
          keyedFinal[zone].data.push(
            niceDate < "2021-03-15"
              ? {
                  x: niceDate,
                  "B.1.1.7": +nums[0].text.split(/\s/)[0],
                  "B.1.351": +nums[1].text.split(/\s/)[0],
                  total: +nums[2].text,
                }
              : {
                  x: niceDate,
                  "B.1.1.7": +f(nums[0].text),
                  "B.1.351": +f(nums[1].text),
                  "P.1": +f(nums[2].text),
                  total: +f(nums[3].text),
                }
          );

          done[zone][niceDate] = true; // mark this date as done
        }
      });
    }
  }
}
let finalOther = [];
// on March 23, variants of concern table was moved to the data app
files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
  // we want to 'skip' files that have already been read
  let d = `${filename.slice(0, 4)}-${filename.slice(4, 6)}-${filename.slice(
    6,
    8
  )}`;
  if (filename >= "20210323") {
    let data = fs.readFileSync(path.join(__dirname, "pages", filename));
    let file = parse(data);
    let table = file.querySelectorAll("#variants-of-concern table");
    rows = table[0].querySelectorAll("tr");
    rows.splice(0, 1);
    rows.forEach((row) => {
      let nums = row.querySelectorAll("td");
      let zone = nums
        .splice(0, 1)[0]
        .text.split(/\r|\n/)
        .join("");
      if (zone == "Alberta") {
        // name of chart also changed
        zone = "In Alberta";
      }
      if (!keyedFinal[zone]) {
        keyedFinal[zone] = {
          name: zone,
          data: [],
        };
        done[zone] = {};
      }
      let niceDate = d;
      if (!done[zone][niceDate]) {
        keyedFinal[zone].data.push(
          niceDate < "2021-04-23"
            ? {
                x: niceDate,
                "B.1.1.7": +g(nums[0].text),
                "B.1.351": +g(nums[1].text),
                "P.1": +g(nums[2].text),
                total: +g(nums[3].text),
              }
            : niceDate < "2021-11-30"
            ? {
                x: niceDate,
                "B.1.1.7": +g(nums[0].text),
                "B.1.351": +g(nums[1].text),
                "B.1.617": +g(nums[2].text),
                "P.1": +g(nums[3].text),
                total: +g(nums[4].text),
              }
            : niceDate < "2021-12-02"
            ? {
                x: niceDate,
                "B.1.1.7": +g(nums[0].text),
                "B.1.351": +g(nums[1].text),
                "B.1.617": +g(nums[2].text),
                "P.1": +g(nums[3].text),
                Kappa: +g(nums[4].text),
                total: +g(nums[5].text),
              }
            : {
                x: niceDate,
                "B.1.1.7": +g(nums[0].text),
                "B.1.351": +g(nums[1].text),
                "B.1.617": +g(nums[2].text),
                "P.1": +g(nums[3].text),
                Kappa: +g(nums[4].text),
                Omicron: +g(nums[5].text),
                total: +g(nums[6].text),
              }
        );
        done[zone][niceDate] = true; // mark this date as done
      }
    });

    if (table[1]) {
      rows = table[1].querySelectorAll("tr");
      rows.splice(0, 1);
      rows.forEach((row) => {
        let nums = row.querySelectorAll("td");
        let zone = nums
          .splice(0, 1)[0]
          .text.split(/\r|\n/)
          .join("");
        if (!keyedOtherFinal[zone]) {
          keyedOtherFinal[zone] = {
            name: zone,
            data: [],
          };
          otherDone[zone] = {};
        }
        let niceDate = d;
        if (!otherDone[zone][niceDate]) {
          keyedOtherFinal[zone].data.push({
            x: niceDate,
            Active: +g(nums[0].text),
            Died: +g(nums[1].text),
            Recovered: +g(nums[2].text),
            Total: +g(nums[3].text),
          });
          otherDone[zone][niceDate] = true; // mark this date as done
        }
      });
    }
  }
}

let final = Object.values(keyedFinal);
// console.dir(keyedOtherFinal, {depth: 999})
fs.writeFileSync("data/dailyVariantCounts.json", JSON.stringify(final));
fs.writeFileSync(
  "data/dailyVariantActiveDiedRecoveredCounts.json",
  JSON.stringify(Object.values(keyedOtherFinal))
);
