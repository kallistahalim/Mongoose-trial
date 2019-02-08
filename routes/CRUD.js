//Dependencies
const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");


// Retrieve data from the db
// router.get("/", (req, res) => {
//     // Find all results from the scrapedData collection in the db
//     db.scrapedData.find({}, function(error, found) {
//       // Throw any errors to the console
//       if (error) {
//         console.log(error);
//       }
//       // If there are no errors, send the data to the browser as json
//       else {
//         res.json(found);
//       }
//     });
//   });
  
  // Scrape data from one site and place it into the mongodb db
router.get("/scrape", (req, res) => {
    // Make a request for the news section of ycombinator
    request("https://www.fandango.com/", function(error, response, html) {
  
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
  
    // An empty array to save the data that we'll scrape
    var results = [];
  
    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("div .poster").each(function(i, element) {
  
      // Save the text of the element in a "title" variable
      var title = $(element).siblings().text();
  
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().attr("href");
  
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    res.send(results);
  });
   
  });
  

  exports.router = function (req, res, next) {
    console.log('here ===');
    res.status(200).end();
};

module.exports = router