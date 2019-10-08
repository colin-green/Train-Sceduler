// When you click the submit button...
$("button").click(function(event) {

    // Prevent page from refreshing
    event.preventDefault();

    // Create a newTrain object and assign user input to properties
    var newTrain = {};
    newTrain.trainName = $("#trainName").val();
    newTrain.destination = $("#destination").val();
    newTrain.firstTrainTime = $("#firstTrainTime").val();
    newTrain.frequency = $("#frequency").val();

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
    tableFirstTrainTime.html(newTrain.firstTrainTime);
    tableFrequency.html(newTrain.frequency);
    tableMinutesAway.html("0");

    // Append the table data cells to the new table row
    newTableRow.append(tableTrainName);
    newTableRow.append(tableDestination);
    newTableRow.append(tableFrequency);
    newTableRow.append(tableFirstTrainTime);
    newTableRow.append(tableMinutesAway);

    console.log(newTrain);
})