const fs = require('fs');
const path = require('path');
const {parse, TextNode} = require('node-html-parser')

let dir2 = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of dir2) {
    if (filename.match(/\.htm/)) {
        let data = fs.readFileSync(path.join(__dirname, "pages", filename));
        let file = parse(data);
        if (filename > '20200615') {
            date = file.querySelector("#last-updated").childNodes[0].rawText;
        } else {
            date = file.querySelector('h4').childNodes[0].rawText;
        }
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        if (!fs.existsSync(`severe/20${myDate}.json`)) {
            if (myDate > 200408) {
                let tables = file.querySelectorAll('#severe-outcomes .table tbody');
                let nodes = tables[0].childNodes.filter(e => !(e instanceof TextNode))
                let stats = [];
                nodes.forEach((childNode, i) => {
                    let rags = [];
                    rags[i] = [];
                    childNode.childNodes.filter((e,i) => !(e instanceof TextNode)).forEach((node, j) => {
                    // rows = node.childNodes.filter(e => !(e instanceof TextNode));
                        let text = (node.childNodes[0].rawText.split(',').join(''));
                    rags[i][j] = j ? Number(text) : String(text.split('\n').join('').split('\r').join('')).trim();       
                    });

                    stats.push({
                        category: rags[i][0], 
                        all_cases: rags[i][1], 
                        hospitalized: rags[i][2], 
                        hospitalized_pct: rags[i][3], 
                        hospitalized_rate: rags[i][4], 
                        icu: rags[i][5], 
                        icu_pct: rags[i][6], 
                        icu_rate: rags[i][7], 
                        deaths: rags[i][8],
                        deaths_pct: rags[i][9], 
                        deaths_rate: rags[i][10]
                    })
                });
                let deets = JSON.stringify(stats);
                fs.writeFileSync(`severe/20${myDate}.json`, deets);

            }
        }
    }
}
