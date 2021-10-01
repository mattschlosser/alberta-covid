const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
  if (filename.match(/\.htm/)) {
    // stats were not provided beofre this time
    if (filename < "2021060317") {
      continue;
    }
    let data = fs.readFileSync(path.join(__dirname, "pages", filename));
    let file = parse(data);
    date = file.querySelector("#last-updated").childNodes[0].rawText;
    let d = new Date(date);
    let myDate = `${("" + d.getFullYear()).slice(-2)}${(
      "0" +
      (d.getMonth() + 1)
    ).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
    if (!fs.existsSync(`severeVaccine/20${myDate}.json`)) {
      let tables = file.querySelectorAll("#vaccine-outcomes ul");
      let stats = {
        unvaxed: { category: "Unvaccinated" },
        vaxed: { category: "Vaccinated" },
        total: { category: "Total" },
      };
      for (let match of ["cases", "hospitalized", "deaths"]) {
        let row = tables[0]?.childNodes.filter((e) => e.innerText.match(match));
        let [_, unvaxed, total] = row[0]?.innerText.match(
          /\(([\d,]*)\/([\d,]*)\)/
        );
        // remove commas from the numbers
        unvaxed = unvaxed.split(",").join("");
        total = total.split(",").join("");
        stats["unvaxed"][match] = Number(unvaxed);
        (stats["vaxed"][match] = total - unvaxed),
          (stats["total"][match] = Number(total));
      }
      let deets = JSON.stringify(Object.values(stats));
      fs.writeFileSync(`severeVaccine/20${myDate}.json`, deets);
    }
  }
}
