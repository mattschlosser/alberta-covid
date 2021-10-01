const fs = require("fs");
const path = require("path");
var { parse } = require("node-html-parser");
const { toNumber, isEmpty } = require("lodash");

let files = fs.readdirSync(path.join(__dirname, "pages"));
let all = [];
let done = {};
for (let filename of files) {
  if (filename.match(/\.htm/)) {
    let data = fs.readFileSync(path.join(__dirname, "pages", filename));
    let file = parse(data);
    if (filename > "20200615") {
      date = file.querySelector("#last-updated").childNodes[0].rawText;
    } else {
      date = file.querySelector("h4").childNodes[0].rawText;
    }
    let d = new Date(date);
    // YYYY-MM-DD
    let myDate = `20${("" + d.getFullYear()).slice(-2)}-${(
      "0" +
      (d.getMonth() + 1)
    ).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
    if (!done[myDate]) {
      // get tiles
      let tiles = file.querySelectorAll(".info-tile");
      let ddd = {};
      for (let tile of tiles) {
        let name = tile.querySelector(".info-tile-small-text")?.text;
        ddd[name] = toNumber(
          tile
            .querySelector(".info-tile-large-text")
            ?.text.split(/[^\d.]/)
            .join("")
        );
      }
      if (!isEmpty(ddd)) {
        ddd.x = myDate;
        all.push(ddd);
      }
      // mark this date as completed
      done[myDate] = true;
    }
  }
}
let final = [
  {
    name: "Alberta",
    data: all,
  },
];
fs.writeFileSync("data/dailyCaseCounts.json", JSON.stringify(final));
