/**
 * Created by thesc on 10/20/2016.
 */
// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/deleteMeLater');
// Create a schema
var MyDaySchema = new mongoose.Schema({
    date: String,
    activities: String,
    survey: String,
    updated_at: { type: Date, default: Date.now },
});
// Create a model based on the schema
var MyDay = mongoose.model('projectDB', MyDaySchema);

// // Create a todo in memory
// var myDay = new MyDay({date: '10/19/16', activities: ['Drank', 'Exercised', 'Played Sports', 'Watched Sports'], survey: [6,8,9]});
// // Save it to database
// myDay.save(function(err){
//   if(err)
//     console.log(err);
//   else
//     console.log(myDay);
// });

MyDay.create({date: '10/20/16', activities: ['Ran', 'Visited Friends', 'Read a Book', 'Went Hiking'], survey: [8,9,7]}, function(err, myDay){
    if(err) console.log(err);
    else console.log(myDay);
});

//Attempt to export document creation capability to app.js

//Test interface between index.html and this database
//$('#submit').click('on', function () {
//    console.log("Submit reads to DB Code");
//});

//// QUERY THE INFORMATION
//// Find all data in the Todo collection
//MyDay.find(function (err, todos) {
//    if (err) return console.error(err);
//    console.log(todos)
//});

// // YOU CAN ALSO ADD QUERIES
// // callback function to avoid duplicating it all over
// var callback = function (err, data) {
//   if (err) { return console.error(err); }
//   else { console.log(data); }
// }
// // Get ONLY completed tasks
// Todo.find({completed: true }, callback);
// // Get all tasks ending with `JS`
// Todo.find({name: /JS$/ }, callback);

// // CHAIN MULTIPLE QUERIES
// var oneYearAgo = new Date();
// oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);
// // Get all tasks staring with `Master`, completed
// Todo.find({name: /^Master/, completed: true }, callback);
// // Get all tasks staring with `Master`, not completed and created from year ago to now...
// Todo.find({name: /^Master/, completed: false }).where('updated_at').gt(oneYearAgo).exec(callback);

// // MONGOOSE UPDATE
// // Model.update(conditions, update, [options], [callback])
// // update `multi`ple tasks from complete false to true
// Todo.update({ name: /master/i }, { completed: true }, { multi: true }, callback);
// //Model.findOneAndUpdate([conditions], [update], [options], [callback])
// Todo.findOneAndUpdate({name: /JS$/ }, {completed: false}, callback);