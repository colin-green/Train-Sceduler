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

// When the button is clicked...
$('button').on("click", function() {

  // Prevent page from refreshing
    event.preventDefault();

    // Takes the user's input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequency").val().trim();

  // Creates local temporary object to hold train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  }

  console.log(newTrain);

    // uploads train data to the database
    database.ref("Trains").push(newTrain);
    // clears all the text-boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

})

// When a new train is added...
database.ref("Trains").on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

    // Store the childSnapshot values into variables
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);

    var currentTime = moment().format("HH:mm");

    // Store the difference between currentTime and fisrt train time
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(firstTrain);
    console.log("Difference in Time: " + timeDiff + " minutes");

    // Find the remainder of the time left
    var timeRemainder = timeDiff % frequency;
    console.log("Time remainder: " + timeRemainder + " minutes");

    var minToTrain = frequency - timeRemainder;

    // Time of the next train
    var nextTrain = moment().add(minToTrain, "minutes").format("h:mm A");
    console.log(nextTrain);

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
  tableTrainName.html(trainName);
  tableDestination.html(destination);
  tableNextArrival.html(nextTrain);
  tableFrequency.html(frequency);
  tableMinutesAway.html(minToTrain + " minutes");

  // Append the table data cells to the new table row
  newTableRow.append(tableTrainName);
  newTableRow.append(tableDestination);
  newTableRow.append(tableFrequency);
  newTableRow.append(tableNextArrival);
  newTableRow.append(tableMinutesAway);

})