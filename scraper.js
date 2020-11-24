const {spawn} = require('child_process')
const fs = require('fs');
const path = require('path');

let file = fs.readFileSync("links.json")
let links = JSON.parse(file);
let i = 0;
for (let link of links) {
    let inst = i;
    let ts = link.split('/')[4];
    if (!fs.existsSync(path.join(__dirname, 'pages', `${ts}.htm`))) {
        let task = () => {
                let proc = spawn('wget', [link, '-O', `pages/${ts}.htm`])
                proc.on('data', (e) => {
                    console.log(data)
                })
                proc.on('exit', e => {
                    console.log(`done ${inst}`);
                })
                proc.on('error', console.error)
                proc.on("message", e => console.log(e))
        }
        setTimeout(task, i++ * 4000);
    } else {
        console.log(`${ts}.htm already exists`)
    }
}
