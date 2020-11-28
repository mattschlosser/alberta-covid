const fs = require('fs');
const {parse, TextNode} = require('node-html-parser')

let dir2 = fs.readdirSync(__dirname);
for (let filename of dir2) {
    if (filename.match(/\.htm/)) {
        let data = fs.readFileSync(filename);
        let file = parse(data);
        date = file.querySelector("#last-updated").childNodes[0].rawText;
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        if (myDate < 301103) {
            let scripts = file.querySelectorAll('[type=application/json]')
            for (let script of scripts) {
                let node = script.childNodes[0]
                if (node instanceof TextNode) {
                    if (node.rawText.match(/Local geograph/)) {
                        fs.writeFileSync(`${myDate}.json`, node.rawText);
                    }
                }
            }
        } else {
            console.error("Not a valid date");
            process.exit(1);
        }
    }
}
