const keys = {};
const fs = require('fs');
const path = require('path');

let files = fs.readdirSync(path.join(__dirname, "local"));
for (let filename of files) {
    if (filename.match(/^20.*?\.json$/)) {
        console.log(filename);
        let buffer = fs.readFileSync(path.join(__dirname, "local", filename));
        let data = JSON.parse(buffer);
        let date = `${filename.slice(0, 4)}-${filename.slice(4, 6)}-${filename.slice(6,8)}`;
        for (let datum of data) {
            if (!keys[datum.name]) {
                keys[datum.name] = {
                    name: datum.name,  
                    data: [], 
                }
            }
            keys[datum.name].data.push({
                x: date, 
                active: datum.active,
                cases: datum.cases,
                recovered: datum.recovered,
                deaths: datum.deaths
            })
        }
    }
}
let out = JSON.stringify(Object.values(keys));
fs.writeFileSync(path.join(__dirname, "local", "all.json"), out)
// console.dir(Object.values(keys), {depth: 200});
