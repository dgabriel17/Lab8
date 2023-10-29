from flask import Flask, render_template, request, jsonify  # Import what we need from the flask library
from flask_sqlalchemy import SQLAlchemy                     # Import sqlalchemy

app = Flask(__name__)

# Create the sql file for the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///creds.sqlite"
db = SQLAlchemy(app)


# Create a class for the database
class creds(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.Float, unique=False, nullable=False)


# Create the database
with app.app_context():
    db.create_all()


@app.route('/')
def main_page():
    return render_template('login.html')


if __name__ == "__main__":
    app.run(debug=True)
