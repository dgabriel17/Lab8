// Make sure the page is loaded first
document.addEventListener('DOMContentLoaded', function() {

    // Create vars for the buttons
    const updateBtn = document.getElementById("button_edit");   // Update grade button
    const name_field = document.getElementById("name_edit");    // Name input
    const grade_field = document.getElementById("grade_edit");  // Grade input
    const class_field = document.getElementById("class_edit");  // Class input

    var myDict = {};

    // Add event listener for the button press for showing the classes a professor is teaching
    window.onload = function () {
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

            //Print out the items in the dictionary (testing purposes)
            for (var key in myDict) {
                var value = myDict[key];
                console.log(key);
                console.log(value);
            }

            // Print out the data from the json response
            let i = 0;      // Looping var

            // Make the html element
            const tab = document.createElement("table");

            const myTable = document.getElementById("student_class");
            myTable.innerHTML = "";                             // Clear the html if it's already populated

            // Make the first table row with the column names
            let first = tab.insertRow(0);
            let col1 = document.createElement("th");        // Create first table header element
            let col2 = document.createElement("th");        // Create second table header element
            let col3 = document.createElement("th");        // Create third table header element
            let col4 = document.createElement("th");        // Create fourth table header element
            let col5 = document.createElement("th");

            col1.textContent = "Course";                    // Text for first header
            col2.textContent = "Professor";                 // Text for second header
            col3.textContent = "Time";                      // Text for third header
            col4.textContent = "Capacity";                  // Text for fourth header
            col5.textContent = "Action";

            first.appendChild(col1);                        // Add the element to the row
            first.appendChild(col2);                        // Add the element to the row
            first.appendChild(col3);                        // Add the element to the row
            first.appendChild(col4);                        // Add the element to the row
            first.appendChild(col5);

            // Add all the data to the table
            for (item in myDict) {
                first = tab.insertRow(i+1);                // Create new row
                col1 = document.createElement("td");        // Create new table data element
                col2 = document.createElement("td");        // Create another table data element
                col3 = document.createElement("td");        // Create another table data element
                col4 = document.createElement("td");        // Create another table data element
                col5 = document.createElement("button");        // Create new table data element
                col5.classList.add('classBtn');

                col1.textContent = myDict[item].Course;
                col2.textContent = myDict[item].Professor;
                col3.textContent = myDict[item].Time;
                col4.textContent = myDict[item].Capacity;
                col5.textContent = "Drop";

                col5.setAttribute("id", col1.textContent);  // Set the id for the button

                first.appendChild(col1);                    // Add the name element to the table
                first.appendChild(col2);                    // Add the grade element to the table
                first.appendChild(col3);
                first.appendChild(col4);
                first.appendChild(col5);
            }

            // Add the final table to the html via and id
            document.getElementById("student_class").appendChild(tab);
            getStudents();

            // Add a click event listener to the document to handle button clicks
            document.addEventListener("click", function (event) {
                if (event.target.tagName === "BUTTON") {

                    console.log(event.target.textContent);  // Get the button's value so we can know what to do

                    addOrDrop(event.target.textContent, event.target.id);    // +/- person from class capacity AND remove/add person to roster table

                    adjust_cap(event.target.textContent, event.target.id);  // Adjust the class capacity

                    window.location.reload();               // Reload to update page
                }
            });
        }
        // Rest the dictionary
        myDict = {};
        };

        // Function to add or remove student from a class
        function addOrDrop(btn, btnId) {

            if (btn === "Drop") {
                console.log("if");
                const request = new XMLHttpRequest();
                let url = window.location.href;            // Current URL value
                url = url + "/" + btnId + "/drop";         // Update the url to match the route we want to take
                request.open("DELETE", url)
                request.send();
                request.onload = () => {

                    // Only do the API call if we get a sucessful response code, else let the user know there was no student
                    if(request.status === 200) {
                        myDict = JSON.parse(request.response);
                    }
                }
            }
            else {
                console.log("else");
                const xhttp = new XMLHttpRequest();
                let url = window.location.href;         // Current URL value
                url = url + "/" + btnId + "/add";       // Update the url to match the route we want to take
                xhttp.open("POST", url)
                xhttp.setRequestHeader("Content-Type", "application/json");

                // Get the name and grade and add it into json format
                const body = {"course": btnId, "student": "placeholder", "grade": "placeholder"};

                // Send the data
                xhttp.send(JSON.stringify(body));
            }
        }

        // Function to increase/decrease the capacity value of a class
        function adjust_cap(btn, btnId) {

            // Check if we are dropping or adding a class
            // If dropping, decrease capacity, if adding, increase capacity
            if (btn === "Add")
            {
                let url = window.location.href;
                url = url + "/" + btnId + "/inc_cap";
                let xhttp = new XMLHttpRequest();
                xhttp.open("PUT", url);
                xhttp.setRequestHeader("Content-Type", "application/json");
                const body = {"course": btnId, "teacher": "placeholder", "time": "placeholder", "students": "students"};
                xhttp.send(JSON.stringify(body));

                // If the request was successful do nothing, if not, let the user know the was no student
                xhttp.onload = () => {
                    if (xhttp.status === 200) {
                    }
                }
            }
            else
            {
                let url = window.location.href;
                url = url + "/" + btnId + "/dec_cap";
                let xhttp = new XMLHttpRequest();
                xhttp.open("PUT", url);
                xhttp.setRequestHeader("Content-Type", "application/json");
                const body = {"course": btnId, "teacher": "placeholder", "time": "placeholder", "students": "students"};
                xhttp.send(JSON.stringify(body));

                // If the request was successful do nothing, if not, let the user know the was no student
                xhttp.onload = () => {
                    if (xhttp.status === 200) {
                    }
                }
            }
        }

        function getStudents() {
                    // Also go and load all the classes and display them in a table
            const request = new XMLHttpRequest();
            let url = window.location.href;                         // Current URL value
            url = url + "/GET_CLASSES/ALL";                                 // Update the url to match the route we want to take
            request.open("GET", url)
            request.send();
            request.onload = () => {

                // Only do the API call if we get a sucessful response code, else let the user know there was no student
                if(request.status === 200) {
                    myDict = JSON.parse(request.response);
                }

                // Print out the data from the json response
                let i = 0;      // Looping var

                // Make the html element
                const tab = document.createElement("table");

                const myTable = document.getElementById("addDrop");
                myTable.innerHTML = "";                             // Clear the html if it's already populated

                // Make the first table row with the column names
                let first = tab.insertRow(0);
                let col1 = document.createElement("th");        // Create first table header element
                let col2 = document.createElement("th");        // Create second table header element
                let col3 = document.createElement("th");        // Create third table header element
                let col4 = document.createElement("th");        // Create fourth table header element
                let col5 = document.createElement("th");

                col1.textContent = "Course";                    // Text for first header
                col2.textContent = "Professor";                 // Text for second header
                col3.textContent = "Time";                      // Text for third header
                col4.textContent = "Capacity";                  // Text for fourth header
                col5.textContent = "Action";

                first.appendChild(col1);                        // Add the element to the row
                first.appendChild(col2);                        // Add the element to the row
                first.appendChild(col3);                        // Add the element to the row
                first.appendChild(col4);                        // Add the element to the row
                first.appendChild(col5);

                // Add all the data to the table
                for (item in myDict) {
                    first = tab.insertRow(i+1);                // Create new row
                    col1 = document.createElement("td");        // Create new table data element
                    col2 = document.createElement("td");        // Create another table data element
                    col3 = document.createElement("td");        // Create another table data element
                    col4 = document.createElement("td");        // Create another table data element
                    col5 = document.createElement("button");        // Create new table data element
                    col5.classList.add('classBtn');

                    col1.textContent = myDict[item].Course;
                    col2.textContent = myDict[item].Professor;
                    col3.textContent = myDict[item].Time;
                    col4.textContent = myDict[item].Capacity;
                    col5.textContent = "Add";

                    col5.setAttribute("id", col1.textContent);  // Set the id for the button

                    first.appendChild(col1);                    // Add the name element to the table
                    first.appendChild(col2);                    // Add the grade element to the table
                    first.appendChild(col3);
                    first.appendChild(col4);
                    first.appendChild(col5);
                }

                // Add the final table to the html via and id
                document.getElementById("addDrop").appendChild(tab);
            }
            // Rest the dictionary
            myDict = {};
        }
});