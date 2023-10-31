import bcrypt
from flask import Flask, render_template, request, jsonify  # Import what we need from the flask library
from flask_sqlalchemy import SQLAlchemy  # Import sqlalchemy
from flask_bcrypt import bcrypt

app = Flask(__name__)
# Bcript = bcrypt(app)

# Create the sql file for the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///creds.sqlite"
db = SQLAlchemy(app)


# Create a class for the database
class creds(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False, nullable=False)
    password = db.Column(db.String, unique=False, nullable=False)


# Create the database
with app.app_context():
    # db.drop_all()
    db.create_all()


# Function to create a user in the database
def new_user(username, password):

    # Make the salt
    mySalt = bcrypt.gensalt()

    # Encode the password (need to do this before hashing)
    password = password.encode()

    # Encrypt/hash the password using the salt
    password = bcrypt.hashpw(password, mySalt)

    # Create a new user with the username and the encrypted password
    this_user = creds(username=username, password=password)

    # Add the user into the database
    with app.app_context():
        db.session.add(this_user)
        db.session.commit()


# Function to check if the password being inputted is the correct
def check(input_pass, stored_pass):

    # Encode the inputted password
    input_pass = input_pass.encode()

    # Encode the password that's in the database
    stored_pass = stored_pass.encode()

    # Return the value for if the password is correct or not
    return bcrypt.checkpw(input_pass, stored_pass)


# new_user("john@college.edu", "abc123") # STUDENT made for testing purposes
# new_user("prof", "thisGUYbruh")

value = check("abc123", "$2b$12$FNbUJximrOcJJnhFbKe6auC293jELQKdlC8y71tZPDxF81egnN51.")
print(value)
value = check("thisGUYbruh", "$2b$12$uUfafgly0tSNvQ.tHfqoM.FbV/I6RyPW7Mz/yqcMtT64tfd8gGrMm")
print(value)

@app.route('/')
def main_page():
    return render_template('login.html')


# Login request
# @app.route('/login'):
#
#     with app.app_context():


if __name__ == "__main__":
    app.run(debug=True)
