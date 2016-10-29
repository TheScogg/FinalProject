var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');


//var bodyParser = require('body-parser')
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//    extended: true
//}));
//
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

// Launch server on Port 3000 //
// Point server at public directory - try to figure out the why of how this works
app.use('/public', express.static('public'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/ecomm_database');

app.set('view engine', 'html');

//Serve index.html when no path is specified
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

////All other paths, default to 404 Page
//app.get('*', function (req, res) {
//    res.send("404 : No Such Page Exists")
//});


// Create MongoDB database
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: String,
    activities: String,
    survey: String
});

var DayModel = mongoose.model('Day', DaySchema);

/* CODE STOLEN FROM https://pixelhandler.com/posts/develop-a-restful-api-using-nodejs-with-express-and-mongoose */
// Display MongoDB JSON data for user
app.get('/db', function (req, res){
    return DayModel.find(function (err, products) {
        if (!err) {
            return res.send(products);
        } else {
            return console.log(err);
        }
    });
});

// Post data to MongoDB database
app.post('/db', function (req, res){
    console.log(req);
    var product;
    var debugJSON = {
        date: "08/22/16",
        activities: "Flying",
        survey: "6"
    };

    //I know this part works well because I can pass in mock values and it saves to database
    product = new DayModel({
        //DEBUGGING INTERNAL SERVER ERROR 500


        date: debugJSON.date,
        activities: req.body.activities,
        survey: req.body.survey
        //date: req.body.date,
        //activities: req.body.activities,
        //survey: req.body.survey
        //date: "Today",
        //activities: "Ran",
        //survey: "Good"
    });
    product.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(product);
});

// Read a single day's data by ID
app.get('/db/:id', function (req, res){
    return DayModel.findById(req.params.id, function (err, product) {
        if (!err) {
            return res.send(product);
        } else {
            return console.log(err);
        }
    });
});

// Update a single day's data by ID
app.put('/db/:id', function (req, res){
    return DayModel.findById(req.params.id, function (err, product) {
        product.title = req.body.date;
        product.description = req.body.activities;
        product.style = req.body.survey;
        return product.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(product);
        });
    });
});

app.listen(3000);
