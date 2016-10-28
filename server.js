var express = require('express');
var mongoose = require('mongoose');
//var http = require('http').Server(app);
var path = require('path');
var app = express();

// Launch server on Port 3000 //
// Point server at public directory - try to figure out the why of how this works
app.use('/public', express.static('public'));

mongoose.connect('mongodb://localhost/ecomm_database');

app.set('view engine', 'html');

app.get('/test', function (req, res) {
    res.send('server.js API has been accessed...');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(3000);

// Create MongoDB database
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: Date,
    activities: [String],
    survey: {Physical: String, Mental: String, Psychological: String}
});

