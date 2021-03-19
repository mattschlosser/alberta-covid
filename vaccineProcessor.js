const fs = require('fs');
const path = require('path');
var {parse} = require('node-html-parser');
const {make_date_from_regex_match} = require('./lib/utils');

let files = fs.readdirSync(path.join(__dirname, "summary"));

let keyedFinal = {
    'Vaccines': {
        name: 'Vaccines', 
        data: []
    }
};  
const processed = {};

for (let filename of files) {
    if (filename.match(/\.aspx/)) {
        let data = fs.readFileSync(path.join(__dirname, "summary", filename));
        let file = parse(data);
        c = file.querySelectorAll('a[href="/covid19-vaccine.aspx"]');
        for (let i of [...c]) {
            let txt = i.parentNode.text;
            // console.log(i.parentNode.text);
            let doses = txt.match(/\d{3,4},\d{3}/)
            if (doses) {
                // console.log(txt);
                date = txt.match(/ (\w*?) (\d{1,2}).?$/);
                // console.log(date[0]);
                realDate = make_date_from_regex_match(date);
                
                // console.log(realDate, doses[0]);
                if (!processed[realDate]) {
                    keyedFinal.Vaccines.data.push({
                        x: realDate, 
                        Doses: Number(doses[0].split(',').join(''))
                    })
                    processed[realDate] = true;
                }
            }
        }
    }
}
let final = Object.values(keyedFinal);
fs.writeFileSync("data/dailyVaccineCounts.json", JSON.stringify(final));
