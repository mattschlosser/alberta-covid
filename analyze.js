var fs = require('fs');
var path = require('path')
var toFind = new RegExp(process.argv[2]);
var mode = "local";
var dire = fs.readdirSync(path.join(__dirname, mode));
for (let filename of dire) {
    if (filename.match(/^20.*?.json/)) {
        let file = fs.readFileSync(path.join(__dirname, mode, filename));
        let data = JSON.parse(file);
        for (let entry of data) {
            if (entry.name.match(toFind)) {
                let arr = new Array(entry.cases).fill('|').join('');
                console.log(entry.name + ' ' + filename.split('.')[0] + ' : ' + arr + ' ' + arr.length);
              // console.log(entry);
            } 
        }
    }
}