const fs = require('fs');
const path = require('path');
const {parse, TextNode} = require('node-html-parser')

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
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
        if (!fs.existsSync(`age/20${myDate}.json`)) {
            if (myDate > 200409) {
                let tables = file.querySelectorAll('.Rtable tbody');
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

                    if (myDate == 201123) {
                        // an extra column was present on this day, remove it
                        stats.push({
                            category: rags[i][0], 
                            male_cases: rags[i][3], 
                            male_percent: rags[i][4], 
                            female_cases: rags[i][5], 
                            female_percent: rags[i][6], 
                            unknown_cases: rags[i][7], 
                            unknown_percent: rags[i][8], 
                            all_cases: rags[i][9], 
                            percent: rags[i][10]
                        })
                    }
                    else if (rags[i].length == 9) {
                        stats.push({
                            category: rags[i][0], 
                            male_cases: rags[i][1], 
                            male_percent: rags[i][2], 
                            female_cases: rags[i][3], 
                            female_percent: rags[i][4], 
                            unknown_cases: rags[i][5], 
                            unknown_percent: rags[i][6], 
                            all_cases: rags[i][7], 
                            percent: rags[i][8]
                        });
                    } else {
                        stats.push({
                            category: rags[i][0], 
                            male_cases: rags[i][1], 
                            male_percent: rags[i][2], 
                            female_cases: rags[i][3], 
                            female_percent: rags[i][4], 
                            unknown_cases: 0, 
                            unknown_percent: 0, 
                            all_cases: rags[i][5], 
                            percent: rags[i][6]
                        })
                    }
                });
                let deets = JSON.stringify(stats);
                fs.writeFileSync(`age/20${myDate}.json`, deets);

            }
        }
    }
}
