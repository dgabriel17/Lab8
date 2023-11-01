// Make sure the page is loaded first
document.addEventListener('DOMContentLoaded', function() {

    // Create vars for the buttons
    const user_type = document.getElementById("user");          // If the user is a student or prof
    const user_name = document.getElementById("username");      // Inputted username
    const pass = document.getElementById("password");           // Inputted password
    const login_button = document.getElementById("loginEnter"); // Login Button

    // Add event listener for the button press for logining in
    login_button.addEventListener("click", function() {

        let url = 'http://127.0.0.1:5000/login/';
        url = url + user_name.value;


    });
});