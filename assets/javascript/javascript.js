var pageLoadTime = moment();

console.log(pageLoadTime);

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
        console.log(firstTrainTimeHours);
        console.log(firstTrainTimeMinutes);

        // Turning the newTrain.firstTrainTime variable into a moment that only shows the time
        newTrain.firstTrainTime = moment().hour(firstTrainTimeHours).minute(firstTrainTimeMinutes);

        nextArrival(newTrain.firstTrainTime, newTrain.frequency);

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
        tableMinutesAway.html(minutesAway(newTrain.firstTrainTime));

        // Append the table data cells to the new table row
        newTableRow.append(tableTrainName);
        newTableRow.append(tableDestination);
        newTableRow.append(tableFrequency);
        newTableRow.append(tableFirstTrainTime);
        newTableRow.append(tableMinutesAway);

        console.log(newTrain);
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