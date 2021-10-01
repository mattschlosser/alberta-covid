const fs = require("fs");
const path = require("path");
var { parse, TextNode } = require("node-html-parser");

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
  let objs = [];
  if (filename.match(/\.htm/)) {
    // vacinne data added May 16
    if (filename < "20210516") continue;
    let data = fs.readFileSync(path.join(__dirname, "pages", filename));
    let file = parse(data);
    date = file.querySelector("#last-updated").childNodes[0].rawText;
    let d = new Date(date);
    let myDate = `${("" + d.getFullYear()).slice(-2)}${(
      "0" +
      (d.getMonth() + 1)
    ).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
    if (!fs.existsSync(`localVaccine/20${myDate}.json`)) {
      // get local data and save to local
      let scripts = file.querySelectorAll('[type="application/json"]');
      for (let script of scripts) {
        let node = script.childNodes[0];
        if (node instanceof TextNode) {
          if (
            node.rawText.match(/At least one dose/) &&
            node.rawText.match(/immunized/) &&
            node.rawText.match(/MAYERTHORPE/i)
          ) {
            let data = JSON.parse(node.rawText);
            let tree = data.x.calls[2].args[4];
            let r = parse(tree);

            let interval = 0;
            let d;
            for (let each of r.childNodes) {
              let lines = each.rawText
                .split(/\s{2,}/)
                .filter((e) => e != "" && e != ",");
              if (!lines.length) {
                continue;
              }
              if (interval % 9 == 0) {
                d = {
                  place: lines[0],
                };
                interval++;
                continue;
              }
              if ((interval - 1) & (9 == 0)) {
                interval++;
                continue;
              }
              if (lines.length) {
                let ageCategory = lines[0].match(/(\d{2}[\+\-](\d{2})*)\:/);
                if (ageCategory) {
                  d[ageCategory[1]] = {
                    percent: Number(lines[0].match(/(\d*)%/)[1]),
                    count: Number(lines[0].match(/(\d*) people/)[1]),
                  };
                } else {
                  ageCategory = lines[0].match(/All ages/);
                  if (ageCategory) {
                    d[ageCategory] = {
                      percent: Number(lines[0].match(/(\d*)%/)[1]),
                      count: Number(lines[0].match(/(\d*) people/)[1]),
                    };
                  }
                }
              }
              interval++;
              if (interval % 8 == 0) {
                objs.push(d);
              }
            }
            let str = JSON.stringify(objs);
            if (objs.length) {
              fs.writeFileSync(`localVaccine/20${myDate}.json`, str);
            }
          }
        }
      }
    }
  }
}
