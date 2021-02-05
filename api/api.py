# coding=utf-8
from __future__ import division, print_function
from flask import Flask,render_template, request, redirect,url_for,session
import pickle,gzip
import numpy as np
import joblib


import sys
import os
import glob
import re
import numpy as np

# Keras
import tensorflow as tf
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.models import load_model
from keras.preprocessing import image
from werkzeug.utils import secure_filename
from flask_cors import CORS

#db
from flask import Flask, render_template, redirect, url_for, flash, session, request, g
import pymongo
from pymongo import MongoClient
from flask_login import LoginManager
from werkzeug.security import generate_password_hash,check_password_hash
import bcrypt
from flask_login import login_user,current_user
from PIL import Image , ImageOps

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

#Pneumonia Model
MODEL_PATH = 'new.h5' #  Replace the Model with the new one.
model = load_model(MODEL_PATH)
filename = 'diabetesModel.pkl'
# classifier = pickle.load(open(filename, 'rb'))
diabetesLoadedModel, means, stds = joblib.load('diabetesModel.pkl')


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/uploads'
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app, expose_headers='Authorization')

#Database
client=MongoClient('mongodb+srv://test:test@cluster0.8dn6j.mongodb.net/<dbname>?retryWrites=true&w=majority')
db=client['Users']
det=[1,3]

from PIL import Image
def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(256,256)) #target_size must agree with what the trained model expects!!
    img = ImageOps.grayscale(img) # uncomment this line and set target size to (256,256).
    # Preprocessing the image
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    preds = model.predict(img)
    return preds
  
@app.route('/pneumonia-predict', methods=['POST','GET'])
def fileUpload():
    result = ''
    print('Lets predict Pneumonia', result)
    if request.method == 'POST':        
        print('HI', os.path, os.getcwd())
        
        target = os.getcwd()+"\\uploads"
        print(target)
        if not os.path.isdir(target):
            os.mkdir(target)
       
        f = request.files['file']
        if f:
            print('Yes ')
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)
        preds = model_predict(file_path, model)
        print(preds)
        os.remove(file_path)
        str1 = 'Pneumonia'
        str2 = 'Normal'
        if preds == 1:
            print(str1)
            result = 'Pneumonia'
        else:
            print(str2) 
            result = 'Normal'
        
        response = "Whatever you wish too return"
        print('1',result)
        return {'result':result}
    

    if request.method == 'GET':
        print(result)
        return {'result': result}
    

@app.route('/', methods=['GET'])
def home():
    return {
        "hi": "Flask"
    }

@app.route('/api', methods=['GET'])
def api():
    return {
        'userId':1,
        'title':'Flask app',
        'completed':False,
    }

@app.route('/predict', methods=['POST','GET'])
def predict():
    if request.method == 'POST':
        preg = int(request.form['pregnancies'])
        glucose = int(request.form['glucose'])
        bp = int(request.form['bloodpressure'])
        st = int(request.form['skinthickness'])
        insulin = int(request.form['insulin'])
        bmi = float(request.form['bmi'])
        dpf = float(request.form['dpf'])
        age = int(request.form['age'])
       
        data = np.array([[preg, glucose, bp, st, insulin, bmi, dpf, age]])
        # my_prediction = classifier.predict(data)
        # m=np.asarray([ 5.46571335e-18, -1.50307117e-16 , 3.22477088e-16 ,-2.39124959e-17,
        #   3.82599935e-17 , 4.91914202e-17,  1.50307117e-16 , 1.17512837e-16])
        # s=np.asarray([1, 1, 1, 1, 1, 1, 1, 1])
        sampleDataFeatures = (data - means)/stds
        predictionProbability = diabetesLoadedModel.predict_proba(sampleDataFeatures)
        res=predictionProbability[0][1]
        print(res)
       
        print(request.url,request.form)
        return render_template('prediction.html', formdata={ 
                    "preg" : int(request.form['pregnancies']),
                    "glucose" : int(request.form['glucose']),
                    "bp" : int(request.form['bloodpressure']),
                    "st" : int(request.form['skinthickness']),
                    "insulin" : int(request.form['insulin']),
                    "bmi" : float(request.form['bmi']),
                    "dpf" : float(request.form['dpf']),
                    "age" : int(request.form['age'])
                    }, res=res)


    # if request.method == 'GET':
    #     return {
    #         "res" : 0.66
    #     }

@app.route('/healthscore', methods=['POST'])
def healthscore():
    if request.method == 'POST':
        print(request.url,'\nNow the data follows',request.json)
        return ''

# AUTHENTICATION CODE
@app.route('/main')
def home1():
    return render_template('index.html')


@app.route('/login')
def login():    
    return render_template('login.html')
    


@app.route('/login', methods=['POST'])
def login_post():
    # session.pop('user',None)
    email=request.form['email']
    password=request.form['password']
    data=db.credentials
    flag=False    
    # session.pop('User',None)      
    print(email, password)
    if not email or not password:
        # flash("Please fill both the fields and Try Again")
        return {'state': 'Fill both fields and try again'}
    
    
    for i in data.find():
        if i['email']==email:
            name=i['username']
            print(i, password, generate_password_hash(password, method='sha256'))            
            if check_password_hash(i['password'], password):    
                flag=True
                session['user']=name 
                print(session['user'])  
                det[0]=name
                det[1]=email                                  
                return {'state':'Approved'}
            
    if flag==False:
        # flash("Invalid Credentials")
        return {'state':'Invalid Credentials'}
    
    return {'state':'Undefined'}
   

    

@app.route('/register')
def reg():
    return render_template('register.html')

@app.route('/register',methods=['POST'])
def reg_post():
    name=request.form.get('name')
    email=request.form.get('email')
    mob=request.form.get('mobile')
    password=request.form.get('password')
    print(email, password)
    password=generate_password_hash(password, method='sha256')
    
    
    data=db.credentials
    for i in data.find():
        if i['email']==email:  
            # flash("Your Email Address is already registered with us")
            return {'state': 'Your Email Address is already registered with us'}
    else:   
        user_info={'username': name,
                'mobile':mob,
                'email': email,
                'password': password} 
        data.insert_one(user_info)
        
    return {'state': 'Approved'}

@app.route('/logout')
def logoute():
    session.pop('user', None)  
    det=[]  
    return redirect(url_for('login'))

@app.route('/profile')
def profile():   
    if g.user:
         return render_template('profile.html',username=det[0],email=det[1])        
    elif det==[]:
        flash("You are kindly requested to Login first")        
        return redirect(url_for('login')) 
   
    flash("You are kindly requested to Login first") 
    return redirect(url_for('login'))

@app.before_request
def before_request():
    g.user=None
    det=[]
    if 'user' in session:
        g.user=session['user']



if __name__ == "__main__":
    app.run(debug=True)