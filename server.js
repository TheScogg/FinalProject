var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
mongoose.connect('mongodb://localhost/projectDB');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.set('view engine', 'html');

// Login System
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: "36f660aa51960b0df2f1",
    clientSecret: "73e223d3cecede8a5d295dec30a1a69ec48ec243",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "-- ENTER CUSTOM SESSION SECRET --"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/', function (req, res) {
  var html = "<ul>\
    <li><a href='/auth/github'>GitHub</a></li>\
    <li><a href='/logout'>logout</a></li>\
        <li><a href='/index'>main page</a></li>\
  </ul>";
    // dump the user for debugging
    if (req.isAuthenticated()) {
    html += "<p>authenticated as user:</p>"
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    res.redirect('/index');

    }
    
  res.send(html);
});

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("access granted. secure stuff happens here");
});


//////////////////////////////////////////////////////////////////






//Serve index.html when no path is specified
app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});



app.get('/logout', function(req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
});

// Create MongoDB database
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: String,
    activities: Object,
    survey: String
});

var username = "TheScogg";

var DayModel = mongoose.model(username, DaySchema);

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

var server = app.listen(3000, function () {
    console.log("Node Server Running at http://%s:%s",
    server.address().address, server.address().port);
});
