/**
 * Merges the two name types. 
 * 
 * At some point, names changes from a format like 
 * "Edmonton - Boonie Doon" to "Edmonton - Boonie Doon (& Nearby Neighbourhoods)"
 * 
 * This script simply merges the two data sets into the same dataset. 
 * 
 */
const fs = require('fs');
const path = require('path');

let all = fs.readFileSync(path.join(__dirname, "local", "all.json"));
let x = JSON.parse(all);
let obj = [];
for (let e of x) {
    // console.log(e.name);
    let i = obj.find(f => {
        if (e.name.startsWith('Calgary - Nose Hill') && f.name == 'Calgary - Nosehill') {
            return true;
        }
        
        
        if (e.name.startsWith("Cochrane") && f.name.startsWith("Cochrane") && e != f) {
            return true;
        }
        if (e.name.search(f.name) == 0 || f.name.search(e.name) == 0) {
            // console.log(`${f.name} matches ${e.name}`);
            if ((e.name.length > f.name.length && e.name[f.name.length+1] == '(') || (f.name.length > e.name.length && f.name[e.name.length+1] == '('))
                return true;
            else
                return false;
        } else {
            return false;
        }
    });
    if (i) {
        // merge
        i.name  = e.name
        i.data = [...i.data, ...e.data];
        // console.log(i.data);
    } else {
        obj.push(e)
    }
}
// console.log(obj);
let out = JSON.stringify(obj);
fs.writeFileSync("all2.json", out)
