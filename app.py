import bcrypt
from flask import Flask, render_template, request, jsonify  # Import what we need from the flask library
from flask_sqlalchemy import SQLAlchemy  # Import sqlalchemy
from flask_bcrypt import bcrypt
from sqlalchemy import and_


app = Flask(__name__)
# Bcript = bcrypt(app)

# Create the sql file for the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///creds.sqlite"
db = SQLAlchemy(app)


# Create a class for the database
class course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    courseName = db.Column(db.String, unique=False, nullable=False)
    teacher = db.Column(db.String, unique=False, nullable=False)
    time = db.Column(db.String, unique=False, nullable=False)
    students = db.Column(db.String, unique=False, nullable=False)


class roster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String, unique=False, nullable=False)
    student = db.Column(db.String, unique=False, nullable=False)
    grade = db.Column(db.Float, unique=False, nullable=False)


# Create the database
with app.app_context():
    db.drop_all()
    db.create_all()

# Populate the db for testing purposes
c1 = course(courseName="CSE 106", teacher="me", time="Thurs", students="20/20")
c2 = course(courseName="CSE 107", teacher="you", time="Mon", students="3/20")
c3 = course(courseName="CSE 111", teacher="me", time="Fri", students="0/20")
c4 = roster(course="CSE 107", student="Carlos", grade=99.2)
c5 = roster(course="CSE 111", student="Luis", grade=84.89)
c6 = roster(course="CSE 106", student="Bodrul", grade=101.2)

with app.app_context():
    db.session.add(c1)
    db.session.add(c2)
    db.session.add(c3)
    db.session.add(c4)
    db.session.add(c5)
    db.session.add(c6)
    db.session.commit()


@app.route('/<userName>')
def main_page(userName):
    name = "Welcome " + userName
    return render_template('profClasses.html', header_text=name)


# Get all the professors classes
@app.route('/<prof>/GET_CLASSES')
def prof_classes(prof):
    # Create an app context to perform the sql actions
    with app.app_context():
        # Perform the query to get all the data
        with app.app_context():
            data = course.query.filter_by(teacher=prof).all()

        # Dictionary for holding the return data
        return_data = {}

        # Fill the dictionary with the data
        for i, item in enumerate(data):
            return_data[i] = {'Course': item.courseName, 'Professor': item.teacher, 'Time': item.time,
                              'Capacity': item.students}
            print(item.courseName)

    # Return the whole dictionary and the proper API response
    return jsonify(return_data), 200


# Get all the students in the professors classes
@app.route('/<prof>/GET_STUDENTS')
def prof_students(prof):
    # dictionary to hold the data we will return
    student_data = {}

    # Create App context to perform the sql queries
    with app.app_context():
        # Get the classes the prof teaches
        mydata = course.query.filter_by(teacher=prof).all()

        # Get the class names and store them in an array
        classes = []  # Classes array
        for item in mydata:
            classes.append(item.courseName)

        # Dictionary will hold all the data to be returned in the json response
        return_data = []

        # Perform the queries for each individual class in the roster database
        for people in classes:
            students = roster.query.filter_by(course=people).all()

            for i, person in enumerate(students):
                student_data = {
                    'Course': person.course,
                    'Name': person.student,
                    'Grade': person.grade
                }
                # Append the student data to the combined data using a unique key (e.g., student's name)
                return_data.append(student_data)

    return jsonify(return_data), 200


# Route to edit a student's grade
@app.route('/<prof>/EDIT_GRADE/<student>', methods=['PUT'])
def prof_edit(prof, student):

    # Get the student's new grade value from the request
    info = request.get_json()
    new_grade = info.get('grade')           # Get the value for the new grade from the json request
    student_class = info.get('class')       # Get the value for what class the student is in from the json request

    # Make a new app context
    with app.app_context():

        # Find the student
        student = roster.query.filter(and_(roster.course == student_class, roster.student == student)).first()

        # Update the grade
        student.grade = new_grade

        # Commit the change to the database
        db.session.commit()

        # Return the change as a json response
        return jsonify(student.grade), 200


if __name__ == "__main__":
    app.run(debug=True)
