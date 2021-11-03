const fs = require("fs");
const path = require("path");
var { parse, TextNode } = require("node-html-parser");

let files = fs.readdirSync(path.join(__dirname, "pages"));
// gets the most recent
filename = files.slice(-1)[0];
let data = fs.readFileSync(path.join(__dirname, "pages", filename));
let file = parse(data);
if (filename > "20200615") {
  date = file.querySelector("#last-updated").childNodes[0].rawText;
} else {
  date = file.querySelector("h4").childNodes[0].rawText;
}
let d = new Date(date);

// get local data and save to local
let scripts = file.querySelectorAll('[type="application/json"]');
for (let script of scripts) {
  let node = script.childNodes[0];
  if (node instanceof TextNode) {
    let i = node.rawText;
    if (
      i.match(/COVID-19 Cases \(n\)/i) &&
      i.match(/Active/) &&
      i.match(/Recovered/)
    ) {
      let deets = JSON.parse(node.rawText).x.data;
      console.dir(deets, { depth: 999 });
      fs.writeFileSync("data/allCaseCounts.json", JSON.stringify(deets));
      break;
    }
  }
}
