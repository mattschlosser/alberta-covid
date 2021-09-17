const fs = require('fs');
const path = require('path');
const {parse, TextNode} = require('node-html-parser');
const { SSL_OP_NETSCAPE_CHALLENGE_BUG } = require('constants');

let files = fs.readdirSync(path.join(__dirname, "pages"));
for (let filename of files) {
    if (filename.match(/\.htm/)) {
        if (filename < '2021060317') {
            continue;
        }
        console.log(filename);
        let data = fs.readFileSync(path.join(__dirname, "pages", filename));
        let file = parse(data);
        date = file.querySelector("#last-updated").childNodes[0].rawText;
        let d = new Date(date);
        let myDate = `${("" + d.getFullYear()).slice(-2)}${("0" + (d.getMonth() + 1)).slice(-2)}${("0" + d.getDate()).slice(-2)}`;
        if (!fs.existsSync(`severeVaccine/20${myDate}.json`)) {
            let tables = file.querySelectorAll('#vaccine-outcomes ul');
            // let hosptialized = tables[0]?.childNodes.filter(e => e.innerText.match(/hospitalized/));
            // let deaths = tables[0]?.childNodes.filter(e => e.innerText.match(/COVID-19 deaths/));
            // console.log(deaths?.[0]?.innerText);
            // if (deaths) {
            let stats = [];
            for (let match of ['cases', 'hospitalized', 'deaths']) {
                let row = tables[0]?.childNodes.filter(e => e.innerText.match(match));
                // console.log(row[0].innerText);
                let [_, unvaxed, total] = row[0]?.innerText.match(/\(([\d,]*)\/([\d,]*)\)/);
                unvaxed = unvaxed.split(',').join('');
                total = total.split(',').join('');
                stats.push({
                    category: match.toString(),
                    unvaxed: Number(unvaxed.split(',').join('')), 
                    vaxed: total-unvaxed, 
                    total: Number(total)
                })
            }
            // let [_, hUnvaxed, hTotal] = hosptialized?.[0]?.innerText.match(/\((\d*)\/(\d*)\)/);

            // let [_, unvaxed, total] = deaths?.[0]?.innerText.match(/\((\d*)\/(\d*)\)/);
            //     // console.log(unvaxed, total);
            // // }
            // let stats = [{
            //     category: 'deaths',
            //     unvaxed: Number(unvaxed), 
            //     vaxed: total-unvaxed,
            //     total: Number(total)
            // }]
            console.log(stats);
            let deets = JSON.stringify(stats);
            fs.writeFileSync(`severeVaccine/20${myDate}.json`, deets);

        }
    }
}
