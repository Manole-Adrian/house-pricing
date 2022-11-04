from flask import Flask, Response, jsonify, make_response, request
import pickle
import joblib
import os
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
file_dir = os.path.dirname(__file__)
rel_path_pickle = "data/labelEncoders.pickle"
rel_path_model = "data/house-predictor2.joblib"
categorical_features = ['location_area', 'partitioning','comfort','real_estate_type','height_regime','level']
columns = ['location_area','subway_dist','partitioning','comfort','furnished','heater_owner','rooms_count','useful_surface','built_surface','construction_year','real_estate_type','height_regime','level','max_level','kitchens_count','bathrooms_count','garages_count','parking_lots_count','balconies_count']


with open(os.path.join(file_dir,rel_path_pickle),'rb') as handle:
    encoders = pickle.load(handle)

model = joblib.load(os.path.join(file_dir, rel_path_model))
#location,subway_dist,partitioning,comfort,furnished,heater_owner,rooms_count,useful_surface,built_surface,construction_year,real_estate_type,height_regime,level,max_level,kitchens_count,bathrooms_count,garages_count,parking_lots_count,balconies_count
@app.route("/get_price")
def get_price():
    args = request.args
    predictDict = dict()
    for col in columns:
        if col == "height_regime":
            predictDict[col] = [args.get(col).replace(" ","+")]
        else:
            predictDict[col] = [args.get(col).replace("_"," ")]
    for col in categorical_features:
        # predictDict[col] = predictDict[col].astype('str')
        predictDict[col] = encoders[col].transform(predictDict[col])
    predictArr = []
    for key in predictDict:
        predictArr.append(int(predictDict[key][0]))
    response = make_response(model.predict([[*predictArr]]).tolist())
    response.headers['Access-Control-Allow-Origin'] = '*'
    return(response)
    