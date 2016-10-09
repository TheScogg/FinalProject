/**
 * Created by Chris on 10/8/2016.
 */
//var fs = require("fs");
//fs.readFile("../docs/file.txt", "utf8", function(error, text) {
//    if (error)
//        throw error;
//    console.log("The file contained:", text);
//    console.log("There were " + text.length + " characters in the file.");
//});


//var http = require("http");
//var server = http.createServer(function(request, response) {
//    response.writeHead(200, {"Content-Type": "text/html"});
//    response.write("<h1>Hello!</h1><p>You asked for <code>" +
//        request.url + "</code></p>");
//    response.end();
//});
//server.listen(8000);
//
//console.log("Server running at 127.0.0.1:8000");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

//Insert Data into Collection
var insertDocument = function(db, callback) {
    db.collection('restaurants').insertOne( {
        "address" : {
            "street" : "2 Avenue",
            "zipcode" : "10075",
            "building" : "1480",
            "coord" : [ -73.9557413, 40.7720266 ]
        },
        "borough" : "Manhattan",
        "cuisine" : "Italian",
        "grades" : [
            {
                "date" : new Date("2014-10-01T00:00:00Z"),
                "grade" : "A",
                "score" : 11
            },
            {
                "date" : new Date("2014-01-16T00:00:00Z"),
                "grade" : "B",
                "score" : 17
            }
        ],
        "name" : "Vella",
        "restaurant_id" : "41704620"
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
    });
});
//
//var findRestaurants = function(db, callback) {
//    var cursor =db.collection('restaurants').find( );
//    cursor.each(function(err, doc) {
//        assert.equal(err, null);
//        if (doc != null) {
//            console.dir(doc);
//        } else {
//            callback();
//        }
//    });
//};

var myObject = {};

var findRestaurants = function(db, callback) {
    var cursor =db.collection('restaurants').find( { "grades.grade": "B" } );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function() {
        db.close();
    });
});