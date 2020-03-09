//
// quiz.js
//

const readlineSync = require('readline-sync');
const path = require('path')
const fs = require('fs')

const folderPath = 'files'
fs.readdirSync(folderPath)

let questionFiles = [];

fs.readdirSync(folderPath).forEach(file => {
//  console.log(file);
  questionFiles.push(file);
});

for (let i of questionFiles)
	console.log(folderPath + path.sep + i);


fs.readFile(folderPath + path.sep + "q01", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})

