const {parse} = require('node-html-parser')

console.log(parse("<a key='val' href='/test.php'></a>").querySelectorAll("a[key=val]")); // works
console.log(parse("<a href='/test.php'></a>").querySelectorAll("a[href='/test.php']")); //nada