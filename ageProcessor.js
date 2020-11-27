const fs = require('fs');
const path = require('path');
const {parse, TextNode} = require('node-html-parser')

let dir2 = fs.readdirSync(path.join(__dirname, "pages"));
console.log(dir2);
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
        console.log(myDate);
        if (!fs.existsSync(`age/20${myDate}.json`)) {
            if (myDate > 200409) {
                // process.exit(0);
                // return;
                let tables = file.querySelectorAll('.Rtable tbody');
                let nodes = tables[0].childNodes.filter(e => !(e instanceof TextNode))
                // console.log(nodes);
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
                            male_deaths: rags[i][4], 
                            femake_cases: rags[i][5], 
                            female_deaths: rags[i][6], 
                            unknown_cases: rags[i][7], 
                            unknown_deaths: rags[i][8], 
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
                        })
                    } else  {
                        stats.push({
                            category: rags[i][0], 
                            male_cases: rags[i][1], 
                            male_deaths: rags[i][2], 
                            femake_cases: rags[i][3], 
                            female_deaths: rags[i][4], 
                            unknown_cases: 0, 
                            unknown_deaths: 0, 
                            all_cases: rags[i][5], 
                            percent: rags[i][6]
                        })
                    }
                });
                console.log(stats);
                let deets = JSON.stringify(stats);
                fs.writeFileSync(`age/20${myDate}.json`, deets);

            }
            // process.exit(1);
            // console.log(nodes0;)
            // console.log(nodes)
            // for (let script of scripts) {
            //     let node = script.childNodes[0]
            //     if (node instanceof TextNode) {
            //         if (node.rawText.match(/Local geograph/)) {no
            //             let parsed = JSON.parse(node.rawText);
            //             console.log("Found");
            //             fs.writeFileSync(`${myDate}.json`, node.rawText);
            //             // process.exit(0);
            //         }
            //     }
            // }
        } else {
            // console.error("Not a valid date");
            // process.exit(1);
        }
    }
}
