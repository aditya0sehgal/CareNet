from flask import Flask,render_template, request, redirect,url_for
import pickle,gzip
import numpy as np
import joblib

filename = 'diabeteseModel.pkl'
# classifier = pickle.load(open(filename, 'rb'))
diabetesLoadedModel, means, stds = joblib.load('diabeteseModel.pkl')

app = Flask(__name__)


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

# @app.route('/recommend', methods=['POST'])
# def recommend():
#         print(url_for("static", filename="index.css"))
#         return redirect(url_for("static", filename="index.css"))


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
        # if res<=0.5:
        #     return {
        #         "res" : 'Non Diabetic'
        #     }
        # elif 0.5>res>0.8:
        #     return {
        #         "res" : 'Pre Diabetic'
        #     }
        # else:
        #     return {
        #         "res" : 'Diabetic'
        #     }
       
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
        

if __name__ == "__main__":
    app.run(debug=True)