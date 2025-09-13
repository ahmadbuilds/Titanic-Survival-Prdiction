import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
import os

app=FastAPI()

load_dotenv()

logistic_regression_model=joblib.load("../models/logistic_regression_model.pkl")
random_forest_model=joblib.load("../models/random_forest_model.pkl")
model_ensemble=joblib.load("../models/xgboost_model.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGIN")],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    Pclass: int
    Sex: str
    Age: int
    Fare: float
    Embarked: str
    FamilySize: int
    isAlone: bool
    Title: Optional[str] = "unknown"
    TicketPrefix: Optional[str] = "unknown"
    CabinLetter: Optional[str] = "unknown"


@app.post("/Prediction")
async def get_prediction(input_data: PredictionInput):
    data_dict=input_data.dict()

    if data_dict["Title"]=="unknown":
        if data_dict["Sex"]=="male":
            data_dict["Title"]="Mr"
        elif data_dict["Sex"]=="female":
            if data_dict["familySize"]>1:
                data_dict["Title"]="Mrs"
            else:
                data_dict["Title"]="Miss"
    
    x_input=pd.DataFrame([data_dict])

    prediction_logistic=logistic_regression_model.predict(x_input)
    prediction_random_forest=random_forest_model.predict(x_input)
    prediction_ensemble=model_ensemble.predict(x_input)

    return {
        "Logistic Regression Prediction": int(prediction_logistic[0]),
        "Random Forest Prediction": int(prediction_random_forest[0]),
        "Ensemble Model Prediction": int(prediction_ensemble[0]),
    }