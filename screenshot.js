const puppeteer = require('puppeteer');

var readline = require('readline');
var async = require('async');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var urls = []

rl.on('line', function(line){
  urls.push(line);
});

rl.on('close', function() {
  (async () => {
    const browser = await puppeteer.launch();
  
    var index = 0;  
    funcs = urls.map(function(url, index) {
      return function(callback) {
        (async () => {
          const page = await browser.newPage();
    
          await page.setViewport({
            width: 1024,
            height: 768
          });

          const filename = 'screenshot_' + index + '.png';
        
          await page.goto(url);
          await page.screenshot({path: filename});

          console.log(url + ' => ' + filename);

          callback();
        })();
      }
    });

    async.series(funcs, function(err, results) {
      browser.close();
    });
  })();
});

