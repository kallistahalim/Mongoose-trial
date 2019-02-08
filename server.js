// Dependencies
const express = require("express");
const mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Database configuration
const databaseUrl = "scraper";
const collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", error => {
  console.log("Database Error:", error);
});

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());                      

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const routes = require("./routes/CRUD");
app.use(routes);
-
// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
