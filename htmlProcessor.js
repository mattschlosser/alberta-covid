const { dir } = require('console');
const fs = require('fs');
const {parse, TextNode} = require('node-html-parser')

let dir2 = fs.readdirSync(__dirname);
console.log(dir2);
for (let filename of dir2) {
    if (filename.match(/\.htm/)) {
        console.log(filename);
        let data = fs.readFileSync(filename);
        let file = parse(data);
        // console.log(file);
        date = file.querySelector("#last-updated").childNodes[0].rawText;
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        console.log(myDate);
        if (myDate < 201103) {
            // process.exit(0);
            // return;
            let scripts = file.querySelectorAll('[type=application/json]')
            for (let script of scripts) {
                let node = script.childNodes[0]
                if (node instanceof TextNode) {
                    if (node.rawText.match(/Local geograph/)) {
                        let parsed = JSON.parse(node.rawText);
                        console.log("Found");
                        fs.writeFileSync(`${myDate}.json`, node.rawText);
                        // process.exit(0);
                    }
                }
            }
        } else {
            console.error("Not a valid date");
            process.exit(1);
        }
    }
}
