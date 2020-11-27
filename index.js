var fs = require('fs');
var dire = fs.readdirSync(__dirname);
for (let filename of dire) {
    if (filename.match(/^20.*?\.json/)) {
        let file = fs.readFileSync(filename)
        let objs = [];;
        let data = JSON.parse(file);
        let tree = data.x.calls[3].args[6]
        // console.log(data.x.calls[1])

        var {parse, HTMLElement, TextNode} = require('node-html-parser')
        let r= parse(tree)
        // console.dir(r.childNodes, {depth: 999});
        let next = '';
        let obj = {};
        for (let each of r.childNodes) {
            // console.log(each);
            if (each instanceof HTMLElement) {
                // console.log(each.childNodes);
                if (each.childNodes[0] instanceof TextNode) {
                    // console.log(each.childNodes);
                    if (next != '') {
                        objs.push(obj);
                        obj = {};
                    }
                    next = each.childNodes[0].rawText;
                    obj.name = next;
                    // console.log(next);
                    // if (next.match(toFind)) {
                        let date = filename.split('.')[0];
                        let d = new Date(`20${date.slice(0, 2)}-${date.slice(2,4)}-${date.slice(4,6)}`)
                        // console.log(`${next} - ${d.toLocaleDateString()}`);
                    // }
                }
            } else if (each instanceof TextNode) {
                // if (next.match(toFind)) {
                    // console.log(each.rawText);
                    let n = Number(each.rawText.split(' ')[1]);
                    if (each.rawText.match(/ase/)) {
                        obj.cases = n
                    } else if (each.rawText.match(/Active/)) {
                        obj.active = n
                    } else if (each.rawText.match(/Recovered/)) {
                        obj.recovered = n
                    } else if (each.rawText.match(/Death/)) {
                        obj.deaths = n
                    }
                // }
            }
        }
        console.log(objs);
        let str = JSON.stringify(objs);
        fs.writeFileSync(`local/20${filename}`, str);
        fs.unlinkSync(filename);
        // process.exit(0);
    }
}
