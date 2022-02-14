const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const reqUrl = process.argv[2];
const filePath = process.argv[3];

if (reqUrl === undefined || filePath === undefined) {
  console.log('Please enter a URL and file path');
  process.exit(1);
}

const downloadAndSaveFile = (filePath, body) => {
  fs.writeFile(filePath, body, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    fs.stat(filePath, (err, stats) => {
      console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
      process.exit(0);
    });
  });
}

request(reqUrl, function (error, response, body) {
  if (error) {
    console.error(error.message); // Print the error if one occurred
    process.exit(1);
  }
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  fs.stat(filePath, (err) => {
    if (err === null) {
      rl.question('This file already exists, would you like to overwrite it? (y for yes) ', (answer) => {
        rl.close();
        if (answer === 'y') downloadAndSaveFile(filePath, body);
      });
    } else {
      downloadAndSaveFile(filePath, body);
    }
  });
});