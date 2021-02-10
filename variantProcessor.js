const fs = require('fs');
const path = require('path');
var {parse, HTMLElement, TextNode} = require('node-html-parser');
const {toNumber, isEmpty} = require('lodash');
const { WatchIgnorePlugin } = require('webpack');

let files = fs.readdirSync(path.join(__dirname, "summary"));
let all = [];
let done = {};
for (let filename of files) {
    if (filename.match(/\.aspx/)) {
        let data = fs.readFileSync(path.join(__dirname, "summary", filename));
        let file = parse(data);
        c = file.querySelectorAll("#goa-grid34045");
        // pull the date from the paragraph
        date = c[0].text.match(/As of ([A-Z][a-z]*) (\d\d?)/)
        month = date[1];
        day = date[2];
        let x = new Date(`2021, ${month} ${day}`);
        r = (x) => `${x.getUTCFullYear()}-${("0"+(x.getUTCMonth()+1)).slice(-2)}-${("0"+(x.getUTCDate())).slice(-2)}`
        let e = [...file.querySelectorAll('#goa-grid34045 li')];
        let d = {
            x: r(x),
            "B.1.1.7": +e[0].text.split(/\s/)[0],
            "B.1.351": +e[1].text.split(/\s/)[0]
        }
        all.push(d);
        console.log(d);
    }
}
let final = [{
    name: 'Alberta', 
    data: all
}]
fs.writeFileSync("data/dailyVariantCounts.json", JSON.stringify(final));
// console.dir(all, {depth: 9999});
