// Dependencies
const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const mongoose = require('mongoose');

// Require request and cheerio. This makes the scraping possible

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

app.engine("handlebars", exphbs({ 
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const routes = require("./routes/CRUD");
app.use(routes);
-
// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
