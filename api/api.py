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
from bson import ObjectId
import datetime

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
        

        # response = "Whatever you wish too return"
        print('1',result)
        data=db.credentials
        now=datetime.datetime.now()
        if (len(session)>=1 and session['id']):
            print(session['user'], session['id'])
            # print(data.find_one({ '_id': session['id']}))
            data.update(
                {'_id': ObjectId(session['id'])},
                # {"username": session['user']},
                { "$push": 
                # {'pneumonia': 10}
                        { 
                        "pneumonia": {
                            "date": now.strftime("%Y-%m-%d %H:%M:%S"),
                            "prediction": result
                        }
                    }
                }
            )
            print(session['user'])

        return {'result':result}
        

    if request.method == 'GET':
        print(result)
        
        return {'result': result}
    

@app.route('/', methods=['GET'])
def home():
    return {
        "hi": "Flask"
    }

@app.route('/sessioninfo', methods=['GET'])
def sessioninfo():
    print(len(session)<1)
    if(len(session)>=1 and session['user']):   
        return {
            "username": session['user']
        }
    else:
        return {
            "username": None
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
        preg = int(request.form.get('pregnancies', False))
        glucose = int(request.form.get('glucose', False))
        bp = int(request.form.get('bloodpressure', False))
        st = int(request.form.get('skinthickness', False))
        insulin = int(request.form.get('insulin', False))
        bmi = float(request.form.get('bmi', False))
        dpf = float(request.form.get('dpf', False))
        age = int(request.form.get('age', False))
       
        data = np.array([[preg, glucose, bp, st, insulin, bmi, dpf, age]])
        # my_prediction = classifier.predict(data)
        # m=np.asarray([ 5.46571335e-18, -1.50307117e-16 , 3.22477088e-16 ,-2.39124959e-17,
        #   3.82599935e-17 , 4.91914202e-17,  1.50307117e-16 , 1.17512837e-16])
        # s=np.asarray([1, 1, 1, 1, 1, 1, 1, 1])
        sampleDataFeatures = (data - means)/stds
        predictionProbability = diabetesLoadedModel.predict_proba(sampleDataFeatures)
        res=predictionProbability[0][1]
        data=db.credentials
        if (len(session)>=1 and session['id']):
            print(session['user'], session['id'])
            # print(data.find_one({ '_id': session['id']}))
            now=datetime.datetime.now()
            data.update(
                {'_id': ObjectId(session['id'])},
                # {"username": session['user']},
                { "$push": 
                # {'pneumonia': 10}
                        { 
                        "diabetes": {
                            "date": now.strftime("%Y-%m-%d %H:%M:%S"),
                            "pregnancies": preg,
                            "glucose":glucose,
                            "bp": bp,
                            "st":st,
                            "insulin":insulin,
                            "bmi":bmi,
                            "dpf":dpf,
                            "age":age,
                            "prediction": round(res,2),
                        }
                    }
                }
            )
        print(res)
        
        print(request.url,request.form)
        return render_template('prediction.html', formdata={ 
                    "preg": preg,
                    "glucose":glucose,
                    "bp": bp,
                    "st":st,
                    "insulin":insulin,
                    "bmi":bmi,
                    "dpf":dpf,
                    "age":age,
                    }, res=res)


    # if request.method == 'GET':
    #     return {
    #         "res" : 0.66
    #     }

@app.route('/healthscore', methods=['POST'])
def healthscore():
    if request.method == 'POST':
        now=datetime.datetime.now()
        request.json["date"] = now.strftime("%Y-%m-%d %H:%M:%S")
        print(request.url,'\nNow the data follows',request.json)

        data=db.credentials
        if (len(session)>=1 and session['id']):
            print(session['user'], session['id'])
            # print(data.find_one({ '_id': session['id']}))
            data.update(
                {'_id': ObjectId(session['id'])},
                # {"username": session['user']},
                { "$push": 
                # {'pneumonia': 10}
                        { 
                        "hgraph": request.json
                    }
                }
            )
        return ''


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
                session['id']=  str(i["_id"])
                print(session)
                print(session['user'])  
                det[0]=name
                det[1]=email                                  
                return {'state':'Approved'}

    if flag==False:
        # flash("Invalid Credentials")
        return {'state':'Invalid Credentials'}
    
    return {'state':'Undefined'}
   


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
                'password': password,
                'diabetes': [],
                'hgraph': [],
                'pneumonia':[]
                 } 
        data.insert_one(user_info)
        
    return {'state': 'Approved'}

@app.route('/logout')
def logoute():
    session.pop('user', None)
    session.pop('id', None)
    print(session)  
    det=[]  
    return {}

@app.before_request
def before_request():
    g.user=None
    det=[]
    if 'user' in session:
        g.user=session['user']



if __name__ == "__main__":
    app.run(debug=True)