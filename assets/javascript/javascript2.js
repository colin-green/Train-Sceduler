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

databaseInit();

$("button").click(addTrain);

function databaseInit() {

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
        })

        if (snapshot.val().trains == null) {

            console.log("No trains yet.")

        } else {

        // For loop?
        for (let i = 1; i < snapshot.val().trains.length; i++) {

            // Send this new object to firebase
            database.ref(`trains/${i}`).set({
            trainName: snapshot.val().trains[i].trainName,
            destination: snapshot.val().trains[i].destination,
            firstTrainTime: snapshot.val().trains[i].firstTrainTime,
            firstTrainTimeMoment: snapshot.val().trains[i].firstTrainTimeMoment,
            nextArrival: nextArrival(snapshot.val().trains[i].firstTrainTimeMoment, snapshot.val().trains[i].frequency),
            frequency: snapshot.val().trains[i].frequency,
            minutesAway: minutesAway(snapshot.val().trains[i].nextArrival)
          });

            // Make a new row for the table
            var newTableRow = $("<tr>");

            // Append it to the table body
            newTableRow.appendTo($("tbody"));

            // Make variables for all the new table data cells
            var tableTrainName = $("<td>");
            var tableDestination = $("<td>");
            var tableNextArrival = $("<td>");
            var tableFrequency = $("<td>");
            var tableMinutesAway = $("<td>");

            // Update the html in the variables to match the user input
            tableTrainName.html(snapshot.val().trains[i].trainName);
            tableDestination.html(snapshot.val().trains[i].destination);
            tableNextArrival.html(snapshot.val().trains[i].nextArrival);
            tableFrequency.html(snapshot.val().trains[i].frequency);
            tableMinutesAway.html(snapshot.val().trains[i].minutesAway);

            // Append the table data cells to the new table row
            newTableRow.append(tableTrainName);
            newTableRow.append(tableDestination);
            newTableRow.append(tableFrequency);
            newTableRow.append(tableNextArrival);
            newTableRow.append(tableMinutesAway);            
            
        }

        }
  
        // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
      }, function(errorObject) {
  
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);

    })

}

// Add train function; will be attached to button click
function addTrain() {

    // Prevent page from refreshing
    event.preventDefault();

    // Increment the trainCounter variable locally
    trainCounter++;

    // Update the trainCounter in the database
    database.ref().update({
        trainCounter: trainCounter
    });

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
        newTrain.firstTrainTimeMoment = moment().hour(firstTrainTimeHours).minute(firstTrainTimeMinutes).second("00");

        // Calling the "nextArrival" function I defined below
        newTrain.nextArrival = nextArrival(newTrain.firstTrainTimeMoment, newTrain.frequency);

        // Make a new object property called "minutesAway" and assign it using the function I defined below
        newTrain.minutesAway = minutesAway(newTrain.nextArrival);

        // Format the nextArrival variable to be a pretty string instead of an ugly object
        newTrain.nextArrival = newTrain.nextArrival.format('h:mm A');

        // Clear fields after submit
        $("#trainName").val('');
        $("#destination").val('');
        $("#firstTrainTime").val('');
        $("#frequency").val('');

        // Console log the object we just made
        console.log(newTrain);

        // Send this new object to firebase
        database.ref(`trains/${trainCounter}`).set({
            trainName: newTrain.trainName,
            destination: newTrain.destination,
            firstTrainTime: newTrain.firstTrainTime,
            firstTrainTimeMoment: newTrain.firstTrainTimeMoment,
            nextArrival: newTrain.nextArrival,
            frequency: newTrain.frequency,
            minutesAway: newTrain.minutesAway
          });

    }

}

function nextArrival(firstTrainTime, frequency) {
    
    // Set variable for current time
    var currentTime = moment();

    // Set variable for "next arrival" (it starts as the user-inputted first train time)
    var nextArrival = firstTrainTime;

    // While "next arrival" is before the current time, add minutes equal to the "frequency"
    while (nextArrival.isBefore(currentTime)) {

        nextArrival = nextArrival.add(frequency, 'minutes');

    }

    return nextArrival;
}

function minutesAway(nextArrival) {

    // Set variable for current time
    var currentTime = moment();

    // Moment already has a useful function for what we're trying to do
    return nextArrival.fromNow(currentTime);
}