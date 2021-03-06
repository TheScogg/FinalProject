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
        chart(data);
    })};

    var myActivities = {
        "activity" : ["Exercised", "Watched TV", "Took a Drive", "Worked", "Visited Friends", "Swimming", "Basketball"]
    };


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

    /* Sorting database data by date, and conveying to ChartsJS */

    // Get & Return dates to function chart()
    function getActivities(data) {
        var activities = [];
        var activitiesArray = [];

        for (item in data) {
            activitiesArray.push(data[item]);
        }

        activitiesArray.sort(function(a,b) { 
            return new Date(a.date).getTime() - new Date(b.date).getTime() 
        });

        for (object in activitiesArray) {
            activities.push(activitiesArray[object].activities)
        }

        return activities;
    }
    
    // Sort dates in ascending order (oldest --> newest) to be fed into chart
    function getDates(data) {
        var dates = [];
        for (val in data) {
            dates.push(data[val].date);
        }

        // Sort Dates in Ascending Order (Oldest --> Newest). Replaces in place, yay!. 
        dates.sort(function(a,b) { 
            return new Date(a).getTime() - new Date(b).getTime() 
        });

        return dates;
    }

    //Get & Return Survey Data for Chart
    function getSurvey(data, surveyIndex) {
        var survey = [];
        dataArray = [];

        for (item in data) {
            dataArray.push(data[item]);
        }
      
        dataArray.sort(function (a,b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime() 
        });

        for (object in dataArray) {
            survey.push(dataArray[object].survey[surveyIndex]);
        }
        return survey;
    }

    //Draw Chart with data from myDay object
    function chart (data) {
        //chartJS : http://www.chartjs.org/docs/#line-chart
        var activities = getActivities(data);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: getDates(data),
                //Object.keys(myDay)
                datasets: [{
                    label: 'Mental',
                    data: getSurvey(data, 0),
                    // data: getChartData(myDay, 0),
                    backgroundColor: "rgba(51,51,51,0.4)"
                }, {
                    label: 'Physical',
                    data: getSurvey(data, 1),
                    backgroundColor: "rgba(244,235,66,0.4)"
                },
                    {
                    label: 'Psychological',
                    data: getSurvey(data, 2),
                    backgroundColor: "rgba(66,244,69,0.4)"
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Your Daily Life Log'
                },
                tooltips: {
                    callbacks: {
                        // Custom Tooltip Labels with Activities for every particular day added
                        label: function(tooltipItems, labelData) {
                            return labelData.datasets[tooltipItems.datasetIndex].label + '\n' + ': ' + tooltipItems.yLabel + "  (" + activities[tooltipItems.index].join(',\n ') + ")";
                        }   
                    }
                }
            }
        });
    }



    getData();
    populateActivities(myActivities);


    function addNewDay(date, activities, surveyArray) {
        console.log(activities);
        var sendInfo = {
            "date": date,
            "activities": activities,
            "survey": surveyArray
        };
        
        // Get all existing database records, and search for date match
        $.get("/db/", function(data, textStatus, jqXHR) { 
            var isMatch = false;
            data.forEach(function (val) {
                // If new date and existing date match, pass id (idMatch) to function (put)
                if (val.date == sendInfo.date) {
                    isMatch = true;
                    idMatch = (val._id);
                }
            });

            // If Record date of request doesn't match existing date, post to database. Otherwise, use put request to update
            if (!isMatch) {post();} else {put(idMatch);}
        }).done(function (data) {
            console.log("$.get Data Loaded", data);
        });


        //Sends a post request to app.post code in server.js
        function post() {
            $.post("http://localhost:3000/db",{
                date: sendInfo.date,
                activities: JSON.stringify(sendInfo.activities), 
                survey: JSON.stringify(surveyArray)}, 
                function(data){
                    if(data==='done')
                    {
                        alert("login success");
                    } else {
                        console.log(data);
                    }
            }).done(function (data) {
                console.log("$.post Data Loaded", data);
                getData()
            });
        }

        // Updates selected existing record, accessed via id (idMatch)
        function put(idMatch) {
            console.log("Duplicate Date at id: " + idMatch);

            jQuery.get("/db/" + idMatch, function(data, textStatus, jqXHR) { 
            console.log("Get resposne:"); 
            // console.dir(data); 
            // console.log(textStatus); 
            // console.dir(jqXHR); 
            }).done(function (data) {
                console.log("==========================================")
                console.log(sendInfo.activities);
                jQuery.ajax({
                    url: "/db/" + idMatch, 
                    type: "PUT",
                    data: {
                        date: sendInfo.date,  
                        activities: JSON.stringify(sendInfo.activities),
                        survey: JSON.stringify(sendInfo.survey)
                    }, 
                    success: function (data, textStatus, jqXHR) { 
                    }
                });
            });


        }

        // Reload chart after POSTING/PUTTING NEW RECORD
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

        $("#surveys").children(".ui-selectmenu-button").each(function (index,val) {
            surveyArray.push($(this).children().text());
        });

        console.log(surveyArray);
        //Add user input (Date, Activities, and Surveys to Mongo Document)
        addNewDay(selectedDate, activities, surveyArray);
        getData();
    });

    $("#debugSubmit").click('on', function (e) {
        e.preventDefault();

        jQuery.ajax({
            url: "/db/581e167580f7853970f54ec4", 
            type: "PUT",
            data: {
            "date": "12/10/2015",  
            "activities": ["Watched TV", "Worked"],  
            "survey": ["3","4","5"]
            }, 
            success: function (data, textStatus, jqXHR) { 
                console.log("Post resposne:"); 
                console.dir(data); 
                console.log(textStatus); 
                console.dir(jqXHR); 
            }
        });
    });

    //When button in #activity div, move to other subDiv    #unselected <---> #selected
    $("#activities button").click('on', function () {
        $(this).parent().siblings().append(this);
    });


});