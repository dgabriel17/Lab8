from flask import Flask, redirect, url_for, render_template, request, jsonify, flash
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import json
from flask_login import LoginManager, current_user, login_user, login_required, logout_user, UserMixin, login_manager
from flask_bcrypt import Bcrypt 

#Configure Flask app
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

#Configure DB
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///example.sqlite" 

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.session_protection = "strong"

app.secret_key = 'keep it secret, keep it safe' # Add this to avoid an error

#set db variable as a SQLAlchemy obj tied to flask app "app"
db = SQLAlchemy(app) 

class Users(UserMixin, db.Model):
        id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
        username = db.Column(db.String, nullable=False)
        password = db.Column(db.String, nullable=False)

        def check_password(self, password):
            return bcrypt.check_password_hash(self.password, password)
            #return self.password == password
        
        def get_id(self):
           return (self.id)
        
        def __repr__(self):
            return self.username

        
class Gradebook(UserMixin, db.Model):
    row_id = db.Column(db.Integer, primary_key=True, nullable=False)
    id = db.Column(db.Integer, nullable=False)
    studentName = db.Column(db.String, nullable=False)
    className = db.Column(db.String, db.ForeignKey('classes.className'), nullable=False)
    Grade = db.Column(db.Integer, nullable=False)
    class_name = db.relationship('Classes', backref=db.backref('studentName', lazy=True))
    def __repr__(self):
        #text = "{'studentName':{student}, 'className':{className}}".format(student=self.studentName, className = self.className)
        return f'{self.studentName}'

class Classes(UserMixin, db.Model):
    className = db.Column(db.String, primary_key=True, nullable=False)
    prof = db.Column(db.String, nullable=False)
    timeInfo = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    def __repr__(self):
        return '<Category %r>' % self.name





def showGradebookSelection(queryArr):
        returnDict = {}

        for student in queryArr: 
                returnDict[getattr(student, 'name')] = getattr(student, 'grade')

        return (returnDict)


@app.route('/')
def renderIndex():
        #Display html file (**All html's go in templates -> CSS & JS go in static)
        return render_template("login.html")


@app.route('/mCS', methods = ['GET'])
@login_required
def run():
        _id = Users.get_id(current_user)

        print(current_user)


        print(_id )

        x = Gradebook.query.filter_by(id = _id).all()

        return render_template('viewClasses.html', rows = x)


@app.route('/addDrop')
@login_required
def addDrop():

    _id = Users.get_id(current_user)

    print(current_user)

    _studentClasses = Gradebook.query.filter_by(id = _id).all()

    _allClasses = Classes.query.all()

    return render_template("add_drop.html", studentName = current_user, classes=_allClasses, studentClasses=_studentClasses)

@app.route('/drop/<classToDrop>')
@login_required
def dropClass(classToDrop):

    _id = Users.get_id(current_user)

    _studentClasses = Gradebook.query.filter_by(id = _id).all()

    hasClass = False
    rowID = None

    for _class in _studentClasses:
         if _class.className == classToDrop:
              hasClass = True
              rowID = _class.row_id
              break
         
    print ("RowID"+str(rowID))

    if hasClass:
         with app.app_context():

            entryToDelete = Gradebook.query.filter_by(row_id = rowID).first()

            if (entryToDelete):
                db.session.delete(entryToDelete)
                db.session.commit()
                return redirect("/success/"+str(current_user))
            else:
                return redirect("/success/"+str(current_user))
            

@app.route('/add/<classToAdd>')
@login_required
def addClass(classToAdd):

    _id = Users.get_id(current_user)

    _studentClasses = Gradebook.query.filter_by(id = _id).all()

    hasClass = False

    for _class in _studentClasses:
         if _class.className == classToAdd:
              hasClass = True
              break
         

    if not hasClass:
         with app.app_context():

            maxRowID = db.session.query(func.max(Gradebook.row_id)).first()

            entryToAdd = Gradebook(row_id = (maxRowID[0]+1), id = int(_id), studentName = str(current_user), className = str(classToAdd), Grade = 0)

            if (entryToAdd):
                
                #Create new Gradebook object with value arguments
                #Add new object to db
                db.session.add(entryToAdd)

                #Commit changes to db
                db.session.commit()
                return redirect("/success/"+str(current_user))
            else:
                return redirect("/success/"+str(current_user))         

  
@app.route('/success/<name>')
@login_required
def success(name):

    _id = Users.get_id(current_user)

    x = Gradebook.query.filter_by(id = _id).all()

    print(current_user)

    return render_template("index.html", content = name, rows=x)

@app.route('/test', methods = ['GET', 'POST'])
@login_required
def test():

    user = Users.get_id(current_user)

    #idNum = user.username

    print (user)
    return jsonify(user)

@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


@app.route('/logout', methods = ['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return render_template("login.html")

@app.route('/login',methods = ['POST'])
def login():

    error = None
    _username = request.form['name']
    _password = request.form['password']

    if current_user.is_authenticated:
        return redirect(url_for('success',name = _username, password = _password))
    user = Users.query.filter_by(username=_username).first()
    if user is None or not user.check_password(_password):
        error = "Invalid Username or Password"
        flash("Incorrect Username or password")
        return render_template("login.html", error = error)
    else:
        login_user(user)
        return redirect(url_for('success',name = _username))

@app.route('/signUp')
def signUp():
    return render_template('signUpForm.html')

@app.route('/createAccount', methods=['POST'])
def createAccount():
     if request.method == 'POST':
        newName = request.form['newName']
        newPassword = request.form['newPassword']

        newPassword = bcrypt.generate_password_hash(newPassword).decode('utf-8') 

        with app.app_context():

            count = db.session.query(Users).count()

            maxID = db.session.query(func.max(Gradebook.row_id)).first()
            #Create new Gradebook object with value arguments
            newStudent = Users(id = (maxID[0]+1), username = newName, password=newPassword)

            #Add new object to db
            db.session.add(newStudent)

            #Commit changes to db
            db.session.commit()

            print("added student")

        print (newName + newPassword)

        return render_template("login.html")


if __name__ == '__main__':
 app.run()