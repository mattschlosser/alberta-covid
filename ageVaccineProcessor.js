const fs = require('fs');
const path = require('path');
const {parse, TextNode} = require('node-html-parser');
const { Console } = require('console');

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
    if (filename.match(/\.htm/)) {
        if (filename < '20210511') continue;
        let data = fs.readFileSync(path.join(__dirname, "pages", filename));
        let file = parse(data);
        if (filename > '20200615') {
            date = file.querySelector("#last-updated").childNodes[0].rawText;
        } else {
            date = file.querySelector('h4').childNodes[0].rawText;
        }
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        if (!fs.existsSync(`ageVaccinations/20${myDate}.json`)) {
            if (myDate > 210408) {
                let tables = file.querySelectorAll(' table tbody')
                // console.log(tables);q
                if (!tables.length) continue;
                let stats = [];
                for (let table of [...tables]) {
                    if (!table.rawText.match(/00-11/)) continue;
                    let nodes = tables[12].childNodes.filter(e => !(e instanceof TextNode))
                    nodes.forEach((childNode, i) => {
                        let rags = [];
                        rags[i] = [];
                        childNode.childNodes.filter((e,i) => !(e instanceof TextNode)).forEach((node, j) => {
                        // rows = node.childNodes.filter(e => !(e instanceof TextNode));
                            let text = (node.childNodes[0].rawText.split(',').join(''));
                            rags[i][j] = j ? Number(text) : String(text.split('\n').join('').split('\r').join('')).trim();       
                        });

                        stats.push({
                            age_group: rags[i][0], 
                            population: rags[i][1], 
                            dose_1: rags[i][2], 
                            dose_1_pct: rags[i][3], 
                            dose_2: rags[i][4], 
                            dose_2_pct: rags[i][5], 
                            total: rags[i][6]
                        })
                    });
                    // console.log(stats)
                }
                // }
                // break;
                if (stats.length) {
                    let deets = JSON.stringify(stats);

                    fs.writeFileSync(`ageVaccinations/20${myDate}.json`, deets);
                }

            }
        }
    }
}
