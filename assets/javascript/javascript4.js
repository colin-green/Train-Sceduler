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

// When the button is clicked...
$('button').on("click", function() {

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

database.ref("Trains").on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

    // Store the childSnapshot values into variables
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;

})