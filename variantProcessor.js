const fs = require('fs');
const path = require('path');
var {parse} = require('node-html-parser');

let files = fs.readdirSync(path.join(__dirname, "summary"));

let keyedFinal = {
    'In Alberta': {
        name: 'In Alberta', 
        data: []
    }
};

function make_date_from_regex_match(date) {
    month = date[1];
    day = date[2];
    let x = new Date(`2021, ${month} ${day}`);
    return `${x.getUTCFullYear()}-${("0"+(x.getUTCMonth()+1)).slice(-2)}-${("0"+(x.getUTCDate())).slice(-2)}`
}

let done = {
    'In Alberta': {}
};
for (let filename of files) {
    if (filename.match(/\.aspx/)) {
        let data = fs.readFileSync(path.join(__dirname, "summary", filename));
        let file = parse(data);
        c = file.querySelectorAll("#goa-grid34045");
        // pull the date from the paragraph
        date = c[0].text.match(/As of ([A-Z][a-z]*) (\d\d?)/)
        let all = keyedFinal['In Alberta'].data;
        if (date) {
            let e = [...file.querySelectorAll('#goa-grid34045 li')];
            let b117 = +e[0].text.split(/\s/)[0];
            let b1351 = +e[1].text.split(/\s/)[0];
            let niceDate = make_date_from_regex_match(date);
            if (!done[niceDate]) {
                let d = {
                    x: niceDate,
                    "B.1.1.7": b117,
                    "B.1.351": b1351,
                    "total": b117 + b1351
                }
                all.push(d);    
                done[niceDate] = true;
            }
        } else {
            // we will assume the variants
            let table = file.querySelectorAll(".goa-table")[1];
            rows = table.querySelectorAll('tr')
            rows.splice(0,1);
            rows.forEach(row => {
                let zone = row.querySelector('th').text;
                let nums = row.querySelectorAll('td');
                if (!keyedFinal[zone]) {
                    keyedFinal[zone] = {
                        name: zone, 
                        data: []
                    }
                    done[zone] = {};
                }
                let date = table.querySelector('em').text.match(/Table updated ([A-Z][a-z]*?\.) (\d\d?)/);
                let niceDate = make_date_from_regex_match(date);
                if (!done[zone][niceDate]) {
                    keyedFinal[zone].data.push({
                        x: niceDate,
                        'B.1.1.7': +nums[0].text.split(/\s/)[0], 
                        'B.1.351': +nums[1].text,
                        "total": +nums[2].text
                    })
                    console.log(keyedFinal[zone])
                    done[zone][niceDate] = true; // mark this date as done
                }
            })
        }
    }
}
let final = Object.values(keyedFinal);
fs.writeFileSync("data/dailyVariantCounts.json", JSON.stringify(final));
