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

@app.route('/userdata', methods=['GET'])
def userdata():

    data=db.credentials
    print(session)
    # print(data.find_one({ '_id': ObjectId(session['id'])})['diabetes'])

    return {
        'faltudata': 'hi',
        'diabetesdata': data.find_one({ '_id': ObjectId(session['id'])})['diabetes'],
        'hgraphdata': data.find_one({ '_id': ObjectId(session['id'])})['hgraph'],
        'pneumoniadata': data.find_one({ '_id': ObjectId(session['id'])})['pneumonia'],
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
        print(preg,glucose,bp)
        data = np.array([[preg, glucose, bp, st, insulin, bmi, dpf, age]])
        
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
        return {
                    "preg": preg,
                    "glucose":glucose,
                    "bp": bp,
                    "st":st,
                    "insulin":insulin,
                    "bmi":bmi,
                    "dpf":dpf,
                    "age":age,
                    "res":res,
                    "sessionuser" : len(session)
                }   
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

@app.route('/diabetes-recom', methods=['POST', 'GET'])
def diaRecom():
    if request.method == 'POST':
        print(request.form.get('Smoking', False), request.form.get('Exercise', False),request.form.get('age', False), request.json['Smoking'])
        smoking = str(request.json['Smoking']).lower()
        sleep = float(request.json['Sleep'])
        exercise = int(request.json['Exercise'])
        water = float(request.json['Water'])
        glucose = int(request.json['glucose'])
        bmi = float(request.json['bmi'])
        age = int(request.json['age'])
        recom={}
        
        if smoking=="y":
            recom['smoking']="Smoking can make managing and regulating insulin levels more difficult because high levels of nicotine can lessen the effectiveness of insulin, causing smokers to need more insulin to regulate blood sugar levels. It has also been found that smokers are 30 to 40 percent more likely to develop type 2 diabetes than nonsmokers. Thus, quitting smoking would certainly have a positive impact on your health."
        
        if exercise < 150:
            recom['exercise']="Get at least 150 to 300 minutes of moderate to vigorous intensity aerobic activity per week. Exercises like walking, jogging, swimming could be tried."
        
        if sleep < 7.0:
            recom['sleep']="People with diabetes report sleeping less than 7 hours a night puts them at a higher risk of having elevated blood sugar. In addition to raising blood sugar levels, sleep deprivation also raises the risk of developing insulin resistance in the first place. Thus avoiding caffeinated beverages at night, Stick to consistent sleep times and indulging in regular physical activity would help."
        
        if water < 2.6:
            recom['water']="When it comes to hydration, water is the best option for people with diabetes as it won’t raise your blood sugar levels. Drinking enough water can help your body eliminate excess glucose through urine. Thus, drink at least 2.6L of water everyday."
        
        if glucose<=140:
            recom['glucose']="Glucose level is well within the nominal range."
        elif 140 < glucose <= 199:
            recom['glucose'] = "Glucose level indicates the chances of being prediabetic. Choose foods low in fat and calories and high in fiber. Eat a variety of foods to help you achieve your goals without compromising taste or nutrition."
        elif glucose >= 200:
            recom['glucose'] = "Glucose level is very high as per standard values. Make sure that you have no ketones in your urine and that you are well-hydrated." 

        if age >= 40:
            recom['age'] = "As you are 40+, the risk of diabetes increases and bulk of the cases are reported in this range. Thus, keep a check on your blood pressure and weight and maintain a balanced diet."

        if 18.5<= bmi <= 24.9:
            recom['bmi'] = "BMI value is reasonably normal. Maintain it by indulging in physical activity regularly."
        elif 25.0 <= bmi <= 29.9:
            recom['bmi'] = "BMI value indicates you are overweight. Cut down on the intake of food having high levels of fats and calories."
        elif bmi >= 30.0:
            recom['bmi'] = "BMI value is abnormally high and indicates obesity. Eat healthy snacks and a healthy, balanced meal that's low in fat and calories and limit the amount of a particular food group, such as high-carbohydrate or full-fat foods. Keep a track of your weight."
        elif bmi < 18.5:
            recom['bmi'] = "BMI value falls in the underweight category. Thus, nutrient rich food is a must for you.You may also include moderately calorie-rich food items in your diet."
        
        return {
                    'smoking': recom['smoking'] if 'smoking' in recom.keys() else '-',  
                    'exercise': recom['exercise'] if 'exercise' in recom.keys()  else '-',
                    'water': recom['water'] if 'water' in recom.keys()  else '-',
                    'sleep': recom['sleep'] if 'sleep' in recom.keys()  else '-',
                    'glucose': recom['glucose'] if 'glucose' in recom.keys()  else '-',
                    'bmi': recom['bmi'] if 'bmi' in recom.keys()  else '-',
                    'age': recom['age'] if 'age' in recom.keys()  else '-',
                }   



@app.route('/hgraph-recom', methods=['POST', 'GET'])
def hgraphRecom():
    if request.method == 'POST':
        alcohol = int(request.json['alcoholUse'])
        diastolic = int(request.json['bloodPressureDiastolic'])
        systolic = int(request.json['bloodPressureSystolic'])
        exer = int(request.json['exercise'])
        glucose = int(request.json['glucose'])
        sleep = float(request.json['sleep'])
        age = int(request.json['Age'])
        cholesterol = float(request.json['totalCholesterol'])
        waist = float(request.json['waistCircumference'])
        weight = int(request.json['weight'])
        height = int(request.json['Height'])
        gender = str(request.json['Gender']).lower()
        nicotine = int(request.json['nicotineUse'])
        rec={}

        if cholesterol > 0.75:
            rec['cholestrol'] = "Total cholesterol has the highest weightage. Eat a low-salt diet that emphasizes fruits, vegetables and whole grains. Limit the amount of animal fats and use good fats in moderation and Manage stress."
        
        if 61 <= glucose <=120:
            rec['glucose'] = "Glucose level is well within the nominal range. Maintain this by avoiding food items containing sugar excessively."
        elif glucose>120:
            rec['glucose'] = "Glucose level indicates the chances of being Pre-diabetic or Diabetic. Choose foods low in fat and calories and high in fiber. Eat a variety of foods to help you achieve your goals without compromising taste or nutrition. To get a better understanding, take our Diabetes test."

        if diastolic < 65:
            
            rec['bp'] = "Use more salt. Experts usually recommend limiting salt in your diet because sodium can raise blood pressure, sometimes dramatically. For people with low blood pressure, that can be a good thing. Fluids increase blood volume and help prevent dehydration, both of which are important in treating hypotension."
        elif diastolic > 95:
            rec['bp'] = "Eating a healthy diet, Decreasing the amount of salt in your diet and Losing weight if you're overweight or obese are some of recommendations to be followed."


        if alcohol > 1:
            rec['alcohol'] = "High alcohol consumption has a lot of detrimental effects. Alcohol interferes with the brain’s communication pathways, and can affect the way the brain looks and works.It may also cause heart problems like Cardiomyopathy, Arrhythmias,Stroke and High blood pressure and may also cause liver inflammation. Thus, limiting alcohol consumption is an essential for the betterment of your health."

        if nicotine > 1:
            rec['nicotine'] = "When a person inhales cigarette smoke, the nicotine in the smoke is rapidly absorbed into the blood and starts affecting the brain within 10 seconds. Once there, nicotine triggers a number of chemical reactions that create temporary feelings of pleasure and concentration. Thus, use of nicotine should be eschewed. Keep your mouth busy with gum, hard candy, and crunchy (healthy) food. Use nicotine replacement therapy, like gum, lozenges, or the patch."

        
        if 3 > exer:
            rec['exercise'] = "Exercise strengthens your heart and improves your circulation. The increased blood flow raises the oxygen levels in your body. This helps lower your risk of heart diseases such as high cholesterol, coronary artery disease, and heart attack. Regular exercise can also lower your blood pressure and triglyceride levels. Thus, for a healthy person on weekly basis, the time devoted for exercise should range from 3-12hrs."

        if sleep < 7:
            rec['sleep'] = "People who report sleeping less than 7 hours a night puts them at a higher risk of having elevated blood sugar and hormonal imbalance. Sleep deprivation may cause a person to be more prone to infections, which may take longer to resolve, and respiratory diseases. Thus avoiding caffeinated beverages at night, Stick to consistent sleep times and indulging in regular physical activity would help. Meditation may also help to a certain extent."

        if waist > 34.5 :
            rec['waist'] = "Elevated waist circumference or waistline measurement is an indication of abdominal obesity and increased risk for heart disease, diabetes, high blood pressure, dyslipidemia (elevation of blood cholesterol, triglycerides or both) and nonalcoholic fatty liver disease. Eating more protein and fiber, Reducing added sugar intake,Getting more sleep, Reducing stress and drinking more water are some of the ways to reduce waist circumference."
        elif waist < 30.0:
            rec['waist'] = "Your Waist Circumference is on a lower side. Maintaining a balanced diet with all the essential nutrients and physical activity is neccessary."

        BMI = (weight/(height)**2) *703

        if 18.5<= BMI <= 24.9:
            rec['bmi'] = "BMI value is reasonably normal. Maintain it by indulging in physical activity regularly."
        elif 25.0 <= BMI <= 29.9:
            rec['bmi'] = "BMI value indicates you are overweight. Cut down on the intake of food having high levels of fats and calories."
        elif BMI >= 30.0:
            rec['bmi'] = "BMI value is abnormally high and indicates obesity. Eat healthy snacks and a healthy, balanced meal that's low in fat and calories and limit the amount of a particular food group, such as high-carbohydrate or full-fat foods. Keep a track of your weight."
        elif BMI < 18.5:
            rec['bmi'] = "BMI value falls in the underweight category. Thus, nutrient rich food is a must for you.You may also include moderately calorie-rich food items in your diet."

        return {
            'cholesterol': rec['cholesterol'] if 'cholesterol' in rec.keys() else '-',  
            'exercise': rec['exercise'] if 'exercise' in rec.keys()  else '-',
            'bp': rec['bp'] if 'bp' in rec.keys()  else '-',
            'sleep': rec['sleep'] if 'sleep' in rec.keys()  else '-',
            'glucose': rec['glucose'] if 'glucose' in rec.keys()  else '-',
            'bmi': rec['bmi'] if 'bmi' in rec.keys()  else '-',
            'alochol': rec['alcohol'] if 'alcohol' in rec.keys()  else '-',
            'nicotine': rec['nicotine'] if 'nicotine' in rec.keys()  else '-',
            'waist': rec['waist'] if 'waist' in rec.keys()  else '-',
        }  



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
        return { 'state': 'Approved', "sessionuser" : len(session) }


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
            # print(i, password, generate_password_hash(password, method='sha256'))            
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