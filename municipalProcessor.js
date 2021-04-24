const fs = require('fs');
const path = require('path');
var {parse, HTMLElement, TextNode} = require('node-html-parser');

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
        if (!fs.existsSync(`municipal/20${myDate}.json`)) {
            // get local data and save to local
            let scripts = file.querySelectorAll('[type="application/json"]')
            for (let script of scripts) {
                let node = script.childNodes[0]
                if (node instanceof TextNode) {
                    if (node.rawText.match(/Local geograph/)) {
                        let data = JSON.parse(node.rawText);
                        // console.log(data);
                        let objs = [];;
                        // this changes over time. look for call with addPolygons
                        let tree
                        if (myDate >= '210420') {
                            tree = data.x.calls[2].args[4] 
                        } else if (myDate >= '201123') {
                            tree = data.x.calls[2].args[6] 
                        } else {
                            tree = data.x.calls[1].args[6]
                        }
                        console.log("THIS IS BEFORE", myDate, data.x.calls[2].args[6]);

                        let r= parse(tree)
                        // console.dir(data.x.calls[3].args[4]);
                        
                        let next = '';
                        let obj = {};
                        for (let each of r.childNodes) {
                            if (each instanceof HTMLElement) {
                                if (each.childNodes[0] instanceof TextNode) {
                                    if (next != '') {
                                        objs.push(obj);
                                        obj = {};
                                    }
                                    next = each.childNodes[0].rawText;
                                    obj.name = next;
                                }
                            } else if (each instanceof TextNode) {
                                let n = Number(each.rawText.split(' ')[1]);
                                if (each.rawText.match(/ase/) && !obj.cases /* only match the first - assuming there has been at least a case in every region */) {
                                    obj.cases = n
                                } else if (each.rawText.match(/Active/)) {
                                    obj.active = n
                                } else if (each.rawText.match(/Recovered/)) {
                                    obj.recovered = n
                                } else if (each.rawText.match(/Death/)) {
                                    obj.deaths = n
                                }
                            }
                        }
                        let str = JSON.stringify(objs);
                        if (objs.length) {
                            fs.writeFileSync(`municipal/20${myDate}.json`, str);
                        }
                    }
                }
            }
        }
    }
}
