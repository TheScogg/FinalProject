/**
 * Created by thesc on 9/29/2016.
 */

//IMPORTANT NOTES FOR LATER
/* Date : {selectedDate} Global Variable */

//Create Object to store
    //Date
    //Selected Buttons
    //Happiness Survey Results

//GraphJS / FusionCharts

$(document).ready(function () {
    //Object which will hold selected date, activities, and survey data.
    var myDay = {
        //'10/06/16' : {'activities' : ['ran', 'smoked cigarettes', 'talked to friend'],
        //    'survey' : [10,8,9]
        //}
    };

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

    function chart (myDay) {
        var myData = [9,5,8,3,5,10,5,9];

        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: myData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    chart(myDay);

    $("#submit").click('on', function (e) {
        e.preventDefault();
        populateDB(selectedDate, activities, survey);
    });


});