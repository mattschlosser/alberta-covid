const fs = require('fs');
const path = require('path');


// // local
// files = fs.readdirSync(path.join(__dirname, "local"));
// for (let filename of files) {
//     if (filename.match(/^20.*?\.json$/)) {
//         console.log(filename);
//         let buffer = fs.readFileSync(path.join(__dirname, "local", filename));
//         let data = JSON.parse(buffer);
//         let date = `${filename.slice(0, 4)}-${filename.slice(4, 6)}-${filename.slice(6,8)}`;
//         for (let datum of data) {
//             if (!keys[datum.name]) {
//                 keys[datum.name] = {
//                     name: datum.name,  
//                     data: [], 
//                 }
//             }
//             keys[datum.name].data.push({
//                 x: date, 
//                 active: datum.active,
//                 cases: datum.cases,
//                 recovered: datum.recovered,
//                 deaths: datum.deaths
//             })
//         }
//     }
// }
// let out = JSON.stringify(Object.values(keys));
// fs.writeFileSync(path.join(__dirname, "local", "all.json"), out)

function shape_dir(dirname, nameKey, keysToCopy) {
    let keys = {};
    let files = fs.readdirSync(path.join(__dirname, dirname));
    for (let filename of files) {
        if (filename.match(/^20.*?\.json$/)) {
            let buffer = fs.readFileSync(path.join(__dirname, dirname, filename));
            let data = JSON.parse(buffer);
            let date = `${filename.slice(0, 4)}-${filename.slice(4, 6)}-${filename.slice(6,8)}`;
            for (let datum of data) {
                if (!keys[datum[nameKey]]) {
                    keys[datum[nameKey]] = {
                        [nameKey]: datum[nameKey],  
                        data: [], 
                    }
                }

                let obj = {x: date};
                for (let key of keysToCopy) {
                    obj[key] = datum[key];
                }
                
                keys[datum[nameKey]].data.push(obj)
            }
        }
    }
    let out = JSON.stringify(Object.values(keys));
    console.log(out);
    fs.writeFileSync(path.join(__dirname, dirname, "all.json"), out)
}
// local
shape_dir("local", "name", ["active", "cases", "recovered", "deaths"]);

// age
shape_dir("age", "category", ["male_cases", "male_percent", "female_cases", "female_percent", "unknown_cases", "unknown_percent", "all_cases", "percent"])

// console.dir(Object.values(keys), {depth: 200});
