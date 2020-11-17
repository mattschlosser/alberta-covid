const {spawn} = require('child_process')
const fs = require('fs');
let file = fs.readFileSync("links.json")
let links = JSON.parse(file);
let i = 0;
for (let link of links) {
    let inst = i;
    let task = () => {
        let ts = link.split('/')[4];
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
    setTimeout(task, i++ * 4000)
}
