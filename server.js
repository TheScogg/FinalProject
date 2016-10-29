var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');
var path = require('path');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

mongoose.connect('mongodb://localhost/projectDB');

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
    activities: Object,
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
    console.log(req.body.activities);
    var day;

    day = new DayModel({
        date: req.body.date,
        activities: JSON.parse(req.body.activities),
        survey: req.body.survey
    });
    day.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(day);
});


//app.post('/db',function(req,res){
//    var user_name=req.body.user;
//    var password=req.body.password;
//    console.log("User name = "+user_name+", password is "+password);
//    res.end("yes");
//});


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

app.listen(8080, function () {
    console.log("Started on PORT 8080")
});
