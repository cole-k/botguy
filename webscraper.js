'use strict';
// Adapated from an example found on codementor, credit to them:
// https://www.codementor.io/johnnyb/how-to-write-a-web-scraper-in-nodejs-du108266t
const cheerio = require("cheerio"),
      req = require("tinyreq");

function scrape(url, data, callback) {
    req(url, (err, body) => {
        if (err) { return callback(err);}

        let $ = cheerio.load(body),
            pageData = {};

        Object.keys(data).forEach( key => {
            pageData[data[key]] = $(data[key]);
        });

        callback(null, pageData);
    });
}

module.exports = scrape;
