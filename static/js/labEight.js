// Make sure the page is loaded first
document.addEventListener('DOMContentLoaded', function() {

    // Buttons
    const ask_input = document.getElementById("ask_name");
    const ask_button = document.getElementById("ask_name_button");
    const edit_input_name = document.getElementById("edit_grade_name");
    const edit_input_grade = document.getElementById("edit_grade_grade");
    const edit_button = document.getElementById("edit_grade_button");
    const add_input_name= document.getElementById("add_student_name");
    const add_input_grade = document.getElementById("add_student_grade");
    const add_button = document.getElementById("add_student_button");
    const delete_input = document.getElementById("delete_student");
    const delete_button = document.getElementById("delete_student_button");
    const all_button = document.getElementById("all");

    var myDict = {};

    // Make a function to create the table with the grades
    function tab(json_res, id) {

        // Clear the html if there is already a table at this location
        const daDiv = document.getElementById(id)
        daDiv.innerHTML = "";

        let i = 0;                                      // Loop var

        const book = document.createElement("table");

        // Create the header row with labels
//        let first = book.insertRow(0);                  // Create first row
//        let col1 = document.createElement("th");        // Create first table header element
//        let col2 = document.createElement("th");        // Create second table header element
//        col1.textContent = "Name";                      // Text for first header
//        col2.textContent = "Grade";                     // Text for second header
//        first.appendChild(col1);                        // Add the element to the row
//        first.appendChild(col2);                        // Add the element to the row

        // Add all the students/grades into the gradebook
        for (key in json_res) {
            first = book.insertRow(i);                // Create new row
            col1 = document.createElement("td");        // Create new table data element
            col2 = document.createElement("td");        // Create another table data element
            col1.textContent = key;                     // Write the student's name to the table element's value
            col2.textContent = json_res[key];           // Write their grade to the table element's value
            first.appendChild(col1);                    // Add the name element to the table
            first.appendChild(col2);                    // Add the grade element to the table
        }

        // Add the final table to the html via and id
        document.getElementById(id).appendChild(book);

    }

    //Begin adding event listeners for the buttons
    all_button.addEventListener("click", function() {

        // Do a get call to get the api data
        const request = new XMLHttpRequest();
        request.open("GET", "http://127.0.0.1:5000/GET_ALL")
        request.send();
        request.onload = () => {

            // Only do the API call if we get a sucessful response code
            if(request.status === 200) {
                myDict = JSON.parse(request.response);
                console.log(myDict);
            }

            // Print out the items in the dictionary (testing purposes)
            for (var key in myDict) {
                var value = myDict[key];
                console.log(key);
                console.log(value);
            }

            // Create the table with the data
            tab(myDict, "grades_table");
        }

        // Rest the dictionary
        myDict = {};
    });

    edit_button.addEventListener("click", function() {

        // Rest the color of the text in case it was changed in the last button click
        edit_input_name.style.color = 'black';
        edit_input_grade.style.color = 'black';

        // Do the api request
        let url = 'http://127.0.0.1:5000/EDIT_STUDENT/';
        url = url + edit_grade_name.value;
        console.log(edit_grade_name.value);
        let xhttp = new XMLHttpRequest();
        xhttp.open("PUT", url);
        xhttp.setRequestHeader("Content-Type", "application/json");
        let newGrade = edit_grade_grade.value;
        console.log(newGrade);
        const body = {"grade": newGrade};
        xhttp.send(JSON.stringify(body));

        // If the request was successful do nothing, if not, let the user know the was no student
        xhttp.onload = () => {
            if (xhttp.status === 200) {
                console.log("done");
//                console.log(xhttp.response)
            }
            else {
                 edit_input_name.style.color = 'red';
                 edit_input_name.value = "Student not in grade book";
                 edit_input_grade.style.color = 'red';
                 edit_input_grade.value = "Student not in grade book";
            }
        }

        // table to show the person's info
//        const disp = {"name": edit_input_name.value, "grade": newGrade};
//        tab(disp, "edit_table");
    });

    add_button.addEventListener("click", function() {

        // Create a post api call
        let url = 'http://127.0.0.1:5000/ADD_STUDENT';
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-Type", "application/json");

        // Get the name and grade and add it into json format
        let name = add_student_name.value;
        let grade = add_student_grade.value;
        console.log(name);
        console.log(grade);
        const body = {"name": name, "grade": grade};

        // Send the data
        xhttp.send(JSON.stringify(body));
//        body = JSON.parse(body);
//        tab(body, "add_table");
    });

    delete_button.addEventListener("click", function() {

        // Rest the color of the text in case it was changed on the last button click
        delete_input.style.color = 'black';

        // Do the api request
        const request = new XMLHttpRequest();
        url = "http://127.0.0.1:5000/DELETE_STUDENT/";
        url = url + delete_input.value;
        console.log(delete_input.value);
        request.open("DELETE", url);
        request.send();
        request.onload = () => {

            // Check if the request was successful, if not let the user know there was no student
            if (request.status === 200) {
                console.log("done");
                myDict = JSON.parse(request.response);
                console.log(myDict)
            }
            else {
                 delete_input.style.color = 'red';
                 delete_input.value = "Student not in grade book";
            }
        }

        // table to show the person's info
//        const disp = {"name": delete_input.value, "grade": "n/a"};
//        tab(disp, "delete_table");
    });

    ask_button.addEventListener("click", function() {

        // Rest the color of the text in case it was changed in the last button click
        ask_input.style.color = 'black';

        // Do api call to get the data for the specific student
        const request = new XMLHttpRequest();
        url = "http://127.0.0.1:5000/GET_STUDENT/";
        console.log(ask_input.value);
        url = url + ask_input.value;
        request.open("GET", url)
        request.send();
        request.onload = () => {

            // Only do the API call if we get a sucessful response code, else let the user know there was no student
            if(request.status === 200) {
                myDict = JSON.parse(request.response);
            }
            else {
                 ask_input.style.color = 'red';
                 ask_input.value = "Student not in grade book";

            }

            // Print out the items in the dictionary (testing purposes)
            for (var key in myDict) {
                var value = myDict[key];
                console.log(key);
                console.log(value);
            }

            // Create the table with the data
            tab(myDict, "find_table");
        }

        // Rest the dictionary
        myDict = {};
    });

});