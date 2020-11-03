const fs = require('fs');
const path = require('path');

let all = fs.readFileSync(path.join(__dirname, "local", "all.json"));
let x = JSON.parse(all);
let obj = [];
for (let e of x) {
    // console.log(e.name);
    let i = obj.find(f => {
        if (e.name.search(f.name) == 0 || f.name.search(e.name) == 0) {
            // console.log(`${f.name} matches ${e.name}`);
            return true;
        } else {
            return false;
        }
    });
    if (i) {
        // merge
        i.data = [...i.data, ...e.data];
        // console.log(i.data);
    } else {
        obj.push(e)
    }
}
console.log(obj);
let out = JSON.stringify(obj);
fs.writeFileSync("all2.json", out)