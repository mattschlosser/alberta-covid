/**
 * Runs wget for every file in the links.json and saves to pages/{timestamp}.htm
 */

const {spawn} = require('child_process')
const fs = require('fs');
const path = require('path');

let file = fs.readFileSync("links.json")
let links = JSON.parse(file);
let i = 0;
for (let link of links) {
    let ts = link.split('/')[4];
    // create a pages dir if none exists
    if (!fs.existsSync(path.join(__dirname, "pages"))) {
        fs.mkdirSync(path.join(__dirname, "pages"));
    }
    if (!fs.existsSync(path.join(__dirname, 'pages', `${ts}.htm`))) {
        let task = () => {
            spawn('wget', [link, '-O', `pages/${ts}.htm`])
        }
        setTimeout(task, i++ * 4000);
    } else {
        console.log(`${ts}.htm already exists`)
    }
}
