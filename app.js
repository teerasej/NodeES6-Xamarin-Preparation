'use strict'

const fs = require('fs');
const path = require('path');
const readline = require('readline');


// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Enter path you want to remove "obj", "bin", and "packages"... \r\n', (answer) => {

//   if (answer == "q" || answer == "exit") {
//     console.log("Good bye :)");
//     rl.close();
//   } else {

//     let rootPath = answer;
//     console.log("Start searching on:", rootPath);

//     if( answer.indexOf("--d") > -1){
//       console.log("Delete mode ON: Going to delete directory that matched.");
//       startSearch(rootPath, "", true);
//     } else {
//       console.log("View mode only, use '--d' for enable deletion");
//       startSearch(rootPath, "", false);
//     }

//   }

// });


let startSearch = (rootPath, internalDir, deleteRequest) => {

  let dir = path.join(rootPath, internalDir);

  let directories = fs.readdirSync(dir)
    .filter(item => {
      return fs.statSync(path.join(dir, item)).isDirectory();
    });

  directories.forEach(dir => {

    let startRemoveThisDir = false;

    if (dir == 'obj') {
      startRemoveThisDir = true;
    } else if (dir == 'bin') {
      startRemoveThisDir = true;
    } else if (dir == 'packages') {
      startRemoveThisDir = true;
    }

    if (startRemoveThisDir) {
      let removingDir = path.join(rootPath, dir);
      console.log('Removing:', removingDir);

      if (deleteRequest) {
        deleteFolderRecursive(removingDir);
      }
    } else {
      startSearch(path.join(rootPath, dir), "", deleteRequest);
    }
  }, this);

};

let deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};



let args = process.argv.slice(2);
// console.dir(args);
let rootPath = args[0];
console.log("Start searching on:", rootPath);

if (args.length == 1) {
  startSearch(rootPath, "", false);
  console.log("NOTE: View mode only, use '--d' for enable deletion");
} else {
  if (args[1] == "--d") {
    
    startSearch(rootPath, "", true);
    console.log("NOTE: Delete mode ON, all listed directories removed.");
  }
} 
