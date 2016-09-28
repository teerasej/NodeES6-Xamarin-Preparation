'use strict'

const fs = require('fs');
const path = require('path');
const readline = require('readline');


const enableRemove = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter path you want to remove "obj", "bin", and "packages"... ', (answer) => {

  if (answer == "q" || answer == "exit") {
    console.log("Good bye :)");
    rl.close();
  } else {

    let rootPath = answer;
    console.log("Start searching on:", rootPath);
    startSearch(rootPath, "");
  }

});


let startSearch = (rootPath, internalDir) => {

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

      if (enableRemove) {
        deleteFolderRecursive(removingDir);
      }
    } else {
      startSearch(path.join(rootPath, dir), "");
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

