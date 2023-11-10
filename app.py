from flask import Flask,jsonify,request,render_template,redirect,url_for,abort,session
from flask_session import Session
from flask_pymongo import PyMongo
import pyrebase
import json
import pymongo


firebase_config = {
    'apiKey': "AIzaSyDVF0P5cuUU8lv2dNt-uc2_JyMOKTl8tBg",
    'authDomain': "music-player-4e33a.firebaseapp.com",
    'projectId': "music-player-4e33a",
    'storageBucket': "music-player-4e33a.appspot.com",
    'messagingSenderId': "441637056363",
    'appId': "1:441637056363:web:541532b9bd0e98e8c2a62e",
    'measurementId': "G-KJMCYXCE8Q",
    'databaseURL':'None'
  }

firebase=pyrebase.initialize_app(firebase_config)
auth=firebase.auth()

app=Flask(__name__)
app.config['SECRET_KEY'] = '$wX2RjLzA3bTkH1iGfSg4MnC5QoDpUqV8xYvZ9sE6uF7tIyPwN'

app.config["SESSION_TYPE"] = "mongodb"

mongo_uri="mongodb+srv://maitybristi53:SllXwJZSpfEqQcpm@cluster0.r0oeefw.mongodb.net/UserData?ssl=true"

mongo=PyMongo(app,mongo_uri,port=9999)
db=mongo.db


app.config["SESSION_MONGODB"] = pymongo.MongoClient(
    host="mongodb+srv://maitybristi53:SllXwJZSpfEqQcpm@cluster0.r0oeefw.mongodb.net/?ssl=true"
)
app.config["SESSION_MONGODB_DB"] = "UserSessions"
app.config["SESSION_MONGODB_COLLECT"] = "sessions"

Session(app)

def Register_user(name,email):
    collection=db.Users
    data={'Email':email.lower(),'Name':name}
    collection.insert_one(data)
    return True

@app.get("/")
def index():
    return Home_page()



@app.post('/register')
def register():
    data=request.get_json()
    email=data.get('mail')
    name=data.get('name')
    password=data.get('password')
    if not email or not name or not password:
        return jsonify({'message':"wrong inputs"}),404
    try:
        # Create a new user in Firebase Authentication
        user = auth.create_user_with_email_and_password(email, password)
        # Send email verification
        auth.send_email_verification(user['idToken'])
        response_data = {
            'message': 'User registration successful. Email verification sent.',
        }
        Register_user(name, email)
        return jsonify(response_data), 200

    except Exception as e:
       print(e)
       error_message = str(e)
       # Find the start and end positions of the 'error' object
       start_idx = error_message.find('{')
       error_object = error_message[start_idx:]
       error = json.loads(error_object)
       error = error['error']
       #print(error)
       error_message = ' '.join(error.get('message', 'Undefined').split('_'))
       return jsonify({'code': error.get('code', '400'), 'message': error_message}),  error.get('code', 400)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('mail', '').lower()
    password = data.get('password', '')  # Get the password from the request
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        session['email']=email
        print(session.get('email',''))
        return jsonify({'code': 200, 'message': 'Login Success'}), 200
        
    except Exception as e:
        error_message = str(e)
        print(e)
        # Find the start and end positions of the 'error' object
        start_idx = error_message.find('{')
        error_object = error_message[start_idx:]
        error = json.loads(error_object)
        error=error['error']
        error_message = ' '.join(error.get('message', 'Undefined').split('_'))
        return jsonify({'code': error.get('code', '400'), 'message':error_message}),  error.get('code', 400)

@app.get('/logout')
def logout():
    session.pop('email','')
    return jsonify({"message":"success"})

@app.get('/home')
def Home_page():
    if 'email' in session:
        collection = db.Users
        user = collection.find_one({'Email': session.get('email')})
        return render_template('index.html', user=user)
    else:
        return render_template('login.html',user={})

@app.get('/search')
def get_search():
    return render_template('search.html')

if __name__=="__main__":
    app.run(port=8080)