var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


// Create MongoDB database
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: String,
    activities: Object,
    survey: Object
});

DaySchema.plugin(passportLocalMongoose);

//Will eventually point to name of user, instead of test name TheScogg

module.exports.DaySchema = DaySchema;

console.log("YAHOOO ")