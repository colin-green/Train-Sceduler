// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAlPJ6e5vIkDzhbGWOR5_ZNzWbm3Kwrkxc",
    authDomain: "coding-bootcamp-cg.firebaseapp.com",
    databaseURL: "https://coding-bootcamp-cg.firebaseio.com",
    projectId: "coding-bootcamp-cg",
    storageBucket: "coding-bootcamp-cg.appspot.com",
    messagingSenderId: "361614518830",
    appId: "1:361614518830:web:e4fcf3a55d61b07f1e4dbf",
    measurementId: "G-R7VCN84CL9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

// Make a variable that references the firebase database (for ease of use)
var database = firebase.database();

// Make a trainCounter variable
var trainCounter;

databaseInit();
databaseTablePop();

// When you click the submit button...
$("button").click(function(event) {

    // Prevent page from refreshing
    event.preventDefault();

    if ($("#trainName").val() == '' || $("#destination").val() == '' || $("#firstTrainTime").val() == '' || $("#frequency").val() == '') {
        alert("You left something blank! Try again.")
    } else {

        // Create a newTrain object and assign user input to properties
        var newTrain = {};
        newTrain.trainName = $("#trainName").val();
        newTrain.destination = $("#destination").val();
        newTrain.firstTrainTime = $("#firstTrainTime").val();
        newTrain.frequency = $("#frequency").val();

        // Getting hours/minutes of user input to help with moment.js formatting
        var firstTrainTimeHours = newTrain.firstTrainTime[0] + newTrain.firstTrainTime[1];
        var firstTrainTimeMinutes = newTrain.firstTrainTime[3] + newTrain.firstTrainTime[4];

        // Turning the newTrain.firstTrainTime variable into a moment that only shows the time
        newTrain.firstTrainTime = moment().hour(firstTrainTimeHours).minute(firstTrainTimeMinutes);

        // Calling the "nextArrival" function I defined below
        nextArrival(newTrain.firstTrainTime, newTrain.frequency);

        // Increment the trainCounter variable locally
        trainCounter++;

        // Update the trainCounter in the database
        database.ref().update({
            trainCounter: trainCounter
        });

        // Store the user input into a new train object in the database
        database.ref(`trains/${trainCounter}`).set({
            trainName: newTrain.trainName,
            destination: newTrain.destination,
            firstTrainTime: newTrain.firstTrainTime,
            frequency: newTrain.frequency
          });

        // Clear fields after submit
        $("#trainName").val('');
        $("#destination").val('');
        $("#firstTrainTime").val('');
        $("#frequency").val('');

        // Make a new row for the table
        var newTableRow = $("<tr>");

        // Append it to the table body
        newTableRow.appendTo($("tbody"));

        // Make variables for all the new table data cells
        var tableTrainName = $("<td>");
        var tableDestination = $("<td>");
        var tableFirstTrainTime = $("<td>");
        var tableFrequency = $("<td>");
        var tableMinutesAway = $("<td>");

        // Update the html in the variables to match the user input
        tableTrainName.html(newTrain.trainName);
        tableDestination.html(newTrain.destination);
        tableFirstTrainTime.html(newTrain.firstTrainTime.format('h:mm A'));
        tableFrequency.html(newTrain.frequency);
        // Here's where I call the "minutesAway" function I defined below
        tableMinutesAway.html(minutesAway(newTrain.firstTrainTime));

        // Append the table data cells to the new table row
        newTableRow.append(tableTrainName);
        newTableRow.append(tableDestination);
        newTableRow.append(tableFrequency);
        newTableRow.append(tableFirstTrainTime);
        newTableRow.append(tableMinutesAway);
    }
})

function nextArrival(firstTrainTime, frequency) {
    
    // Set variable for current time
    var currentTime = moment();

    // Set variable for "next arrival" (it starts as the user-inputted first train time)
    var nextArrival = firstTrainTime;

    // While "next arrival" is before the current time, add minutes equal to the "frequency"
    while (nextArrival.isBefore(currentTime)) {

        nextArrival = nextArrival.add(frequency, 'minutes');

    }

    return nextArrival.format('h:mm A');
}

function minutesAway(nextArrival) {

    // Set variable for current time
    var currentTime = moment();

    // Moment already has a useful function for what we're trying to do
    return nextArrival.fromNow(currentTime);
}

function databaseInit() {

    // Using .on("value", function(snapshot)) syntax will retrieve the data
    // from the database (both initially and every time something changes)
    // This will then store the data inside the variable "snapshot". We could rename "snapshot" to anything.
    database.ref().on("value", function(snapshot) {

        // Then we console.log the value of snapshot
        console.log(snapshot.val());
  
        // If the database is empty, make trainCounter = 0
        if (snapshot.val() == null) {
            trainCounter = 0;

        // Else, make trainCounter equal to the database trainCounter
        } else {
            trainCounter = snapshot.val().trainCounter;
        }

        // Update the database with the new local trainCounter variable
        database.ref().update({
            trainCounter: trainCounter
        });
  
        // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
      }, function(errorObject) {
  
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
      });

}

function databaseTablePop() {

    database.ref().on("value", function(snapshot) {

        // Make a new row for the table
        var newTableRow = $("<tr>");

        // Append it to the table body
        newTableRow.appendTo($("tbody"));

        // Make variables for all the new table data cells
        var tableTrainName = $("<td>");
        var tableDestination = $("<td>");
        var tableFirstTrainTime = $("<td>");
        var tableFrequency = $("<td>");
        var tableMinutesAway = $("<td>");
        
        // Update the html in the variables to match the user input
        tableTrainName.html(snapshot.val().trains[1].trainName);
        tableDestination.html(snapshot.val().trains[1].destination);
        tableFirstTrainTime.html(snapshot.val().trains[1].firstTrainTime);
        tableFrequency.html(snapshot.val().trains[1].frequency);
        // Here's where I call the "minutesAway" function I defined below
        tableMinutesAway.html("0");

        // Append the table data cells to the new table row
        newTableRow.append(tableTrainName);
        newTableRow.append(tableDestination);
        newTableRow.append(tableFrequency);
        newTableRow.append(tableFirstTrainTime);
        newTableRow.append(tableMinutesAway);

        console.log();

    })

}