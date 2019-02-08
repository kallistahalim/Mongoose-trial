//Dependencies
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/scraper');

mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var Schema = new mongoose.Schema({
    Headline: String,
    Summary: String,
    url: String
});


module.exports = mongoose.model('mongooseSchema', Schema);