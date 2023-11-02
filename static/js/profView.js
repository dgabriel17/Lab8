// Make sure the page is loaded first
document.addEventListener('DOMContentLoaded', function() {

    // Create vars for the buttons
    const classesBtn = document.getElementById("classes");      // View classes button
    const studentsBtn = document.getElementById("students");    // View students button
    const updateBtn = document.getElementById("button_edit");   // Update grade button
    const name_field = document.getElementById("name_edit");    // Name input
    const grade_field = document.getElementById("grade_edit");  // Grade input
    const class_field = document.getElementById("class_edit");  // Class input

    var myDict = {};

    // Add event listener for the button press for showing the classes a professor is teaching
    classesBtn.addEventListener("click", function() {

        // Do api call to get the data for the specific student
        const request = new XMLHttpRequest();
        let url = window.location.href;                         // Current URL value
        url = url + "/GET_CLASSES";                                 // Update the url to match the route we want to take
        request.open("GET", url)
        request.send();
        request.onload = () => {

            // Only do the API call if we get a sucessful response code, else let the user know there was no student
            if(request.status === 200) {
                myDict = JSON.parse(request.response);
            }

            // Print out the items in the dictionary (testing purposes)
            for (var key in myDict) {
                var value = myDict[key];
                console.log(key);
                console.log(value);
            }

            // Print out the data from the json response
            let i = 0;      // Looping var

            // Make the html element
            const tab = document.createElement("table");

            const myTable = document.getElementById("class_table");
            myTable.innerHTML = "";                             // Clear the html if it's already populated

            // Make the first table row with the column names
            let first = tab.insertRow(0);
            let col1 = document.createElement("th");        // Create first table header element
            let col2 = document.createElement("th");        // Create second table header element
            let col3 = document.createElement("th");        // Create third table header element
            let col4 = document.createElement("th");        // Create fourth table header element

            col1.textContent = "Course";                    // Text for first header
            col2.textContent = "Professor";                 // Text for second header
            col3.textContent = "Time";                      // Text for third header
            col4.textContent = "Capacity";                  // Text for fourth header

            first.appendChild(col1);                        // Add the element to the row
            first.appendChild(col2);                        // Add the element to the row
            first.appendChild(col3);                        // Add the element to the row
            first.appendChild(col4);                        // Add the element to the row

            // Add all the data to the table
            for (item in myDict) {
                first = tab.insertRow(i+1);                // Create new row
                col1 = document.createElement("td");        // Create new table data element
                col2 = document.createElement("td");        // Create another table data element
                col3 = document.createElement("td");        // Create another table data element
                col4 = document.createElement("td");        // Create another table data element

                col1.textContent = myDict[item].Course; // Write the student's name to the table element's value
                col2.textContent = myDict[item].Professor;    // Write their grade to the table element's value
                col3.textContent = myDict[item].Time;
                col4.textContent = myDict[item].Capacity;

                first.appendChild(col1);                    // Add the name element to the table
                first.appendChild(col2);                    // Add the grade element to the table
                first.appendChild(col3);
                first.appendChild(col4);
            }

            // Add the final table to the html via and id
            document.getElementById("class_table").appendChild(tab);
        }

        // Rest the dictionary
        myDict = {};
    });

    // Button for showing the students
    studentsBtn.addEventListener("click", function() {

        // Do api call to get the data for the specific student
        const request = new XMLHttpRequest();
        let url = ""
        url = window.location.href;                         // Current URL value
        url = url + "/GET_STUDENTS";                                 // Update the url to match the route we want to take
        request.open("GET", url);
        request.send();
        request.onload = () => {

            // Only do the API call if we get a sucessful response code, else let the user know there was no student
            if(request.status === 200) {
                myDict = JSON.parse(request.response);
            }

            // Print out the items in the dictionary (testing purposes)
            for (var key in myDict) {
                var value = myDict[key];
                console.log(key);
                console.log(value);
            }


        // Print out the data from the json response
            let i = 0;      // Looping var

            // Make the html element
            const tab = document.createElement("table");

            const myTable = document.getElementById("student_table");
            myTable.innerHTML = "";                             // Clear the html if it's already populated

            // Make the first table row with the column names
            let first = tab.insertRow(0);
            let col1 = document.createElement("th");        // Create first table header element
            let col2 = document.createElement("th");        // Create second table header element
            let col3 = document.createElement("th");        // Create third table header element

            col1.textContent = "Course";                    // Text for first header
            col2.textContent = "Name";                 // Text for second header
            col3.textContent = "Grade";                      // Text for third header

            first.appendChild(col1);                        // Add the element to the row
            first.appendChild(col2);                        // Add the element to the row
            first.appendChild(col3);                        // Add the element to the row

            // Add all the data to the table
            for (item in myDict) {
                first = tab.insertRow(i+1);                // Create new row
                col1 = document.createElement("td");        // Create new table data element
                col2 = document.createElement("td");        // Create another table data element
                col3 = document.createElement("td");        // Create another table data element

                col1.textContent = myDict[item].Course; // Write the student's name to the table element's value
                col2.textContent = myDict[item].Name;    // Write their grade to the table element's value
                col3.textContent = myDict[item].Grade;

                first.appendChild(col1);                    // Add the name element to the table
                first.appendChild(col2);                    // Add the grade element to the table
                first.appendChild(col3);
            }

            // Add the final table to the html via and id
            document.getElementById("student_table").appendChild(tab);
        }

        // Rest the dictionary
        myDict = {};
    });

    // Button for updating a grade
    updateBtn.addEventListener ("click", function() {

        // Rest the color of the text in case it was changed in the last button click
        class_field.style.color = 'black';
        name_field.style.color = 'black';
        grade_field.style.color = 'black';

        let url = window.location.href;
        url = url + "/EDIT_GRADE/" + name_field.value;
        console.log(name_field.value);
        let xhttp = new XMLHttpRequest();
        xhttp.open('PUT', url);
        xhttp.setRequestHeader("Content-Type", "application/json");
        let newGrade = grade_field.value;
        let currClass = class_field.value;
        console.log(newGrade);

        const body = {"grade": newGrade, "class": currClass};
        xhttp.send(JSON.stringify(body));

        // If the request was successful do nothing, if not, let the user know the was no student
        xhttp.onload = () => {
            if (xhttp.status === 200) {
                console.log("done");
            }
            else {
                 name_field.style.color = 'red';
                 name_field.value = "Student not in grade book";
                 grade_field.style.color = 'red';
                 grade_field.value = "Student not in grade book";
                 class_field.style.color = 'red';
                 class_field.value = "Student not in grade book";
            }
        }
    });

});