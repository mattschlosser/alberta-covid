const fs = require('fs');
const path = require('path');
var {parse, HTMLElement, TextNode} = require('node-html-parser');

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
    let overallDeets = [];
    if (filename.match(/\.htm/)) {
        if (filename < '2021') {
            continue;
        }
        let data = fs.readFileSync(path.join(__dirname, "pages", filename));
        let file = parse(data);
        date = file.querySelector("#last-updated").childNodes[0].rawText;
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        if (!fs.existsSync(`vaccineReactions/20${myDate}.json`)) {

            // get local data and save to local
            let scripts = file.querySelectorAll('[type="application/json"]')
            for (let script of scripts) {
                let node = script.childNodes[0]
                if (node.innerText.match(/Diarrhea/)) {
                    // console.log(node)
                    let allDeets = JSON.parse(node.rawText);
                    let deets = allDeets.x.data[0]
                    // console.log(deets);
                    for (let i in deets.y) {
                        let transformedDeet = {};
                        transformedDeet.category = deets.y[i]
                        transformedDeet.count = deets.x[i]
                        overallDeets.push(transformedDeet)
                    }
                    console.log(overallDeets)
                }
            }
            if (overallDeets.length) {
                str = JSON.stringify(overallDeets);
                fs.writeFileSync(`vaccineReactions/20${myDate}.json`, str);
            }
        }
    }
}
// let lastTwoDays = overallDeets.slice(-2);
// for (let key in lastTwoDays[0]) {
//     console.log(key, lastTwoDays[1][key] - lastTwoDays[0][key])
// }
