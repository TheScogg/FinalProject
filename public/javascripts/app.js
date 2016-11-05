/**
 * Created by thesc on 9/29/2016.
 */

//mongoose = require('mongoose');

//IMPORTANT NOTES FOR LATER
/* Date : {selectedDate} Global Variable */

//GraphJS / FusionCharts

$(document).ready(function () {
    //Get all existing database information
        //This will be used to pass to chart
        //
    var getData = function () {$.get("/db/", function(data, textStatus, jqXHR) { 
        console.log("Post resposne:"); 
        // console.dir(data); 
        // console.log(textStatus); 
        // console.dir(jqXHR); 
        
        //Testing db traversal capabilities, and appending to random div for debug
        data.forEach(function (index,val) {
            $("#chart").append(index.date);
        })

        chart(data);
    })};

    var myActivities = {
        "activity" : ["Exercised", "Watched TV", "Took a Drive", "Worked", "Visited Friends"]
    };

    //////* THINK I'LL BE ABLE TO DELETE AFTER LINKING TO REAL MONGODB DATABASE *///////
    //Object which will hold selected date, activities, and survey data.
    var myDay = {
        '10/06/16' : {'activities' : ['ran', 'smoked cigarettes', 'talked to friend'],
            'survey' : [10,8,9]
        },
        '10/07/16' : {'activities' : ['ran', 'smoked cigarettes', 'talked to friend'],
            'survey' : [5,5,7]
        },
        '10/08/16' : {'activities' : ['ran', 'smoked cigarettes', 'talked to friend'],
            'survey' : [3,4,6]
        }
    };

    var dummyDay = function (data) {

    };

    for (prop in myDay) {
        //console.log(myDay[prop].survey);
    }
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////
    //////*Run the calendar widget and get date from user*//////
    var today = new Date();
    //Defaults to today's date by creating date object and assigning to value attribute of #datepicker div
    var selectedDate = ("0" + today.getMonth()).slice(-2) + "/" + ("0" + today.getDate()).slice(-2)
                            + "/" + today.getFullYear();

    $("#datepicker").attr("value", selectedDate);
    $("#datepicker").click("on", function () {
        $(this).datepicker({
            onSelect: function (date) {
                $("#displayDate").html("Selected Date: " + date);
                //Global variable to store date
                selectedDate = date;
            },
            selectWeek: true,
            inline: true,
            startDate: '01/01/2000',
            firstDay: 1,
            setDate: '7/11/2016'
        }).datepicker("show");
    });

    /////////////////////////////////////////////////////////////
    //////*Make Survey Selections Pretty with selectmenu/////////
    ///// JQUERY UI PLUGIN (Mental, Physical, Psychological*/////
    $( "#physical" ).selectmenu({width:70});
    $( "#mental" ).selectmenu({width:70});
    $( "#psychological" ).selectmenu({width:70});


    //Color activity buttons
    function colorActivities() {

    }

    //Add activity buttons to #activities from activities array
    function populateActivities (activities) {
        var $activityHTML = "";

        //for (activity in activities[activity]) {
        //    $activityHTML += ('<button type="button" class="btn btn-warning">' +
        //        activities[activity] + '</button>')
        //}

        for (var i = 0; i < activities.activity.length; i++) {
                $activityHTML += ('<button type="button" class="btn btn-warning">' +
                    activities.activity[i] + '</button>')
        }

        $("#unselected").append($activityHTML);
    }

    //Get Survey Data for Chart
    function getSurvey(dataObject, surveyIndex) {
        var survey = [];
        console.log("BEFORE")
        for (object in dataObject) {
            survey.push(dataObject[object].survey[surveyIndex]);
        }
        console.log(survey);
        return survey;
    }

    //Draw Chart with data from myDay object
    function chart (data) {
        //chartJS : http://www.chartjs.org/docs/#line-chart
        //Get dates from data object, to be passed into myChart:data:labels
        dates = [];
        dataObject = {};

        for (val in data) {
            dates.push(data[val].date);
            dataObject[data[val].date] = {'activities' : data[val].activities, 'survey' : data[val].survey};
        }

        console.log("MY Data Object: " , dataObject);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                //Object.keys(myDay)
                datasets: [{
                    label: 'Mental',
                    data: getSurvey(dataObject, 0),
                    // data: getChartData(myDay, 0),
                    backgroundColor: "rgba(153,255,51,0.4)"
                }, {
                    label: 'Physical',
                    data: getSurvey(dataObject, 1),
                    backgroundColor: "rgba(244,235,66,0.4)"
                },
                    {
                    label: 'Psychological',
                    data: getSurvey(dataObject, 2),
                    backgroundColor: "rgba(66,244,69,0.4)"
                }]
            }
        });
    }



    getData();
    populateActivities(myActivities);

    /* 
    What is my goal here?
    1. Populate the Chart
        // Iterate through all data in db, assign to chart variables
        
    */

    // Retrieve all existing database documents. 
    // Find a way to search through these. 



    function addNewDay(date, activities, surveyArray) {
        console.log(activities);
        var sendInfo = {
            "date": date,
            "activities": activities,
            "survey": surveyArray
        };

        //Sends a post request to app.get code in server.js
        $.post("http://localhost:3000/db",{date: sendInfo.date,
            activities: JSON.stringify(sendInfo.activities), 
            survey: JSON.stringify(surveyArray)}, function(data){
            if(data==='done')
            {
                alert("login success");
            } else {
                console.log(data);
            }
        });


    }

    /* CLICK EVENTS */
    //Home Page Click Events

//Retrieve Survey Scores. Any way to refactory, instead of running this for all 3 values?
//        $("#physical-button > span.ui-selectmenu-text").text(); 

    $("#submit").click('on', function (e) {
        var activities = [];
        var surveyArray = [];

        //Prevent default action
        e.preventDefault();

        //Retrieves text in all *selected* activity buttons and assigns to array to be passed to addNewDay function
        $("#selected").children("button").each(function (index, value) {
            activities[index] = $(this).text();
        });

        //Retrieves survey scores (default to 5)
        // $("#physical-button > span.ui-selectmenu-text").text(4); 
        // $("#mental-button > span.ui-selectmenu-text").text(4); 
        // $("#psychological-button > span.ui-selectmenu-text").text(4); 

        $("#surveys").children(".ui-selectmenu-button").each(function (index,val) {
            surveyArray.push($(this).children().text());
        });

        console.log(surveyArray);
        //Add user input (Date, Activities, and Surveys to Mongo Document)
        addNewDay(selectedDate, activities, surveyArray);
        getData();
    });

    //When button in #activity div, move to other subDiv    #unselected <---> #selected
    $("#activities button").click('on', function () {
        $(this).parent().siblings().append(this);
    });


});