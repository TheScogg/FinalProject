/**
 * Created by thesc on 9/29/2016.
 */

//IMPORTANT NOTES FOR LATER
/* Date : {selectedDate} Global Variable */

//GraphJS / FusionCharts

$(document).ready(function () {
    //var myActivities = ["Exercised", "Watched TV", "Took a Drive", "Worked", "Visited Friends"];
    var myActivities = {
        "activity" : ["Exercised", "Watched TV", "Took a Drive", "Worked", "Visited Friends"]
    };

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
        console.log(myDay[prop].survey);
    }

    var activities = [];
    var survey = [];

    //Run the calendar widget and get date from user
    $("#datepicker").click("on", function () {
        $(this).datepicker({
            onSelect: function (date) {
                $("#displayDate").html("Today's Date Is " + date);
                //Global variable to store date
                selectedDate = date;
            },
            selectWeek: true,
            inline: true,
            startDate: '01/01/2000',
            firstDay: 1
        }).datepicker("show");
    });

    //Add new data to myDay object
    function populateDB () {

    }

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

        $("#activities span").append($activityHTML);
    }

    //Pull chart data from myDay object and return array to data prop in chart function
    function getChartData(myDay, index) {
        var myArray = new Array;

        for (prop in myDay) {
            myArray.push(myDay[prop].survey[index]);
        }

        console.log(myArray);
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


    $("#submit").click('on', function (e) {
        e.preventDefault();
        populateDB(selectedDate, activities, survey);
    });


});