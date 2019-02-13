//Dependencies
const express = require('express');
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const db = require("../db/Article");


//empty array to store data
var result = [];

// Scrape data from one site and place it into the mongodb db
router.get("/", (req, res) => {

      // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
      request("https://zoo.sandiegozoo.org/animals-plants", (error, response, html) => {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("div .views-row").each(function (i, element) {

              // Save the text of the element in a "title" variable
              var link = $(element).children().children().children().attr("href");

              // In the currently selected element, look at its child elements (i.e., its a-tags),
              // then save the values for any "href" attributes that the child elements may have
              var images = $(element).children().children().children().children().attr("src");

              var name = $(element).children(".views-field-field-teaser-heading").children().children().children().text();
              var summary = $(element).children(".views-field-field-content-summary").children().children().text();
              // Save these results in an object that we'll push into the results array we defined earlier
              result.push({
                link: link,
                images: images,
                summary: summary,
                name: name
              });
            });

              // Log the results once you've looped through each of the elements found with cheerio
              // console.log(results);
              res.render("index", {
                articles: result
              });

            });
          });

            router.get("/save", function (req, res) {
              db.Article.find({})
                .then(function (dbArticle) {
                  res.render("save", {
                    save: dbArticle
                  })
                })
                .catch(function (err) {
                  res.json(err);
                });
            })

            router.post("/api/save", function (req, res) {
              db.Article.create(req.body)
                .then(function (dbArticle) {
                  res.json(dbArticle)
                })
                .catch(function (err) {
                  res.json(err)
                })
            })

            router.delete("/save/:id", function (req, res) {
              db.Article.deleteOne({
                _id: req.params.id
              }).then(function (removed) {
                res.json(removed)
              }).catch(function (err) {
                res.json(err)
              })
            })

            router.get("/note/:id", function (req, res) {
              db.Article.findOne({
                  _id: req.params.id
                })
                .populate("note")
                .then(function (dbArticle) {
                  console.log("usdhucs", dbArticle)
                  res.render("note", {
                    data: dbArticle
                  })
                })
                .catch(function (err) {
                  res.json(err)
                });
            })

            router.post("/note/:id", function (req, res) {
              db.Note.create(req.body)
                .then(function (dbNote) {
                  db.Article.findOneAndUpdate({
                      _id: req.params.id
                    }, {
                      $push: {
                        note: dbNote._id
                      }
                    }, {
                      new: true
                    })
                    .then(function (dbArticle) {
                      res.json(dbArticle)
                    })
                    .catch(function (err) {
                      res.json(err)
                    })
                })
                .catch(function (err) {
                  res.json(err)
                })
            })

            router.delete("/note/:id", function (req, res) {
              db.Note.deleteOne({
                _id: req.params.id
              }).then(function (deleted) {
                res.json(deleted)
              }).catch(function (err) {
                res.json(err)
              })
            })


            exports.router = function (req, res, next) {
              console.log('here ===');
              res.status(200).end();
            };

            module.exports = router;