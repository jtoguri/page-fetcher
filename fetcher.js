const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const reqUrl = process.argv[2];
const filePath = process.argv[3];

request(reqUrl, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  if (error !== null || response.statusCode !== 200) process.exit();``
  
  fs.stat(filePath, (err) => {
    if (err === null) {
      rl.question('This file already exists, would you like to overwrite it? (y for yes) ', (answer) => {
        if (answer !== 'y') rl.close();
        else {
          fs.writeFile(filePath, body, () => {
            fs.stat(filePath, (err, stats) => {
              console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
            });
          });
          rl.close();
        }
      });
    } else {
      fs.writeFile(filePath, body, err => {
        if (err) {
          console.error(err);
          process.exit();
        }
        fs.stat(filePath, (err, stats) => {
          console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
          process.exit();
        });
      });
    }
  });
});