/**
 * Created by thesc on 9/29/2016.
 */

//mongoose = require('mongoose');

//IMPORTANT NOTES FOR LATER
/* Date : {selectedDate} Global Variable */

//GraphJS / FusionCharts

$(document).ready(function () {
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

    //Pull chart data from myDay object and return array to data prop in chart function
    function getChartData(myDay, index) {
        var myArray = new Array;

        for (prop in myDay) {
            myArray.push(myDay[prop].survey[index]);
        }

        //return [index+1, index+2, index+3];
        return myArray;
    }

    //Draw Chart with data from myDay object
    function chart (myDay) {
        //chartJS : http://www.chartjs.org/docs/#line-chart
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(myDay),
                datasets: [{
                    label: 'Mental',
                    data: getChartData(myDay, 0),
                    backgroundColor: "rgba(153,255,51,0.4)"
                }, {
                    label: 'Physical',
                    data: getChartData(myDay, 1),
                    backgroundColor: "rgba(244,235,66,0.4)"
                },
                    {
                    label: 'Psychological',
                    data: getChartData(myDay, 2),
                    backgroundColor: "rgba(66,244,69,0.4)"
                }]
            }
        });


    }

    populateActivities(myActivities);
    chart(myDay);

    function addNewDay(date, activities, surveyArray) {
        console.log(activities);
        var sendInfo = {
            "date": date,
            "activities": activities,
            "survey": surveyArray
        };

        //ASK WHY IT POSTS WHEN CONVERTED TO STRING, BUT NOT AS ARRAY.
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
    });

    //When button in #activity div, move to other subDiv    #unselected <---> #selected
    $("#activities button").click('on', function () {
        $(this).parent().siblings().append(this);
    });


});