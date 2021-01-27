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
# from keras.preprocessing.image import load_image, image_to_array
from werkzeug.utils import secure_filename


from flask_cors import CORS

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

#Pneumonia Model
MODEL_PATH = 'pneumonia.h5'
model = load_model(MODEL_PATH)
filename = 'diabetesModel.pkl'
# classifier = pickle.load(open(filename, 'rb'))
diabetesLoadedModel, means, stds = joblib.load('diabetesModel.pkl')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/uploads'
CORS(app, expose_headers='Authorization')

def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(64, 64)) #target_size must agree with what the trained model expects!!

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
        
        # target = os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER'])
        target = os.getcwd()+"\\uploads"
        print(target)
        if not os.path.isdir(target):
            os.mkdir(target)
        # logger.info("welcome to upload`")
        f = request.files['file']
        if f:
            print('Yes ')
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)
        
        # filename = secure_filename(file.filename)
        # destination = "/".join([target, filename])
        # file.save(destination)
        # session['uploadFilePath'] = destination
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


# @app.route('/pneumonia-predict', methods=['GET', 'POST'])
# def upload():

#     if request.method == 'POST':
#         # Get the file from post request
#         f = request.files['file']
        
#         # Save the file to ./uploads
#         basepath = os.path.dirname(__file__)
#         file_path = os.path.join(
#             basepath, 'uploads', secure_filename(f.filename))
#         f.save(file_path)

#         # Make prediction
#         preds = model_predict(file_path, model)
#         os.remove(file_path)#removes file from the server after prediction has been returned
#         print(preds)
#         # Arrange the correct return according to the model. 
# 		# In this model 1 is Pneumonia and 0 is Normal.
#         str1 = 'Pneumonia'
#         str2 = 'Normal'
#         if preds == 1:
#             return str1
#         else:
#             return str2
#     return None




if __name__ == "__main__":
    app.run(debug=True)