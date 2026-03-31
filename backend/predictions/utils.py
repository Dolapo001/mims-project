import os
import joblib
import pandas as pd
from django.conf import settings
from pathlib import Path

# Define paths to model artifacts in the sister 'ml_engine' directory
# BASE_DIR is 'backend/' so we go up one level to reach the root
ML_ENGINE_DIR = Path(settings.BASE_DIR).parent / 'ml_engine'
MODEL_PATH = ML_ENGINE_DIR / 'models' / 'model.pkl'
PREPROCESSOR_PATH = ML_ENGINE_DIR / 'models' / 'preprocessor.pkl'
LABEL_ENCODER_PATH = ML_ENGINE_DIR / 'models' / 'label_encoder.pkl'

def load_ml_artifacts():
    """
    Load the trained model, preprocessor, and label encoder from the ml_engine service.
    """
    try:
        # Check if files exist to avoid loading errors
        if not MODEL_PATH.exists():
            print(f"Error: Model not found at {MODEL_PATH}")
            return None, None, None

        model = joblib.load(str(MODEL_PATH))
        preprocessor = joblib.load(str(PREPROCESSOR_PATH))
        label_encoder = joblib.load(str(LABEL_ENCODER_PATH))
        
        print(f"Successfully loaded ML artifacts from {ML_ENGINE_DIR}")
        return model, preprocessor, label_encoder
    except Exception as e:
        print(f"Failed to load ML artifacts: {e}")
        return None, None, None

def make_prediction(data_dict, model, preprocessor, label_encoder):
    """
    Perform preprocessing and run prediction.
    """
    df = pd.DataFrame([data_dict])
    X_processed = preprocessor.transform(df)
    
    prediction_idx = model.predict(X_processed)[0]
    probabilities = model.predict_proba(X_processed)[0]
    
    best_platform = label_encoder.inverse_transform([prediction_idx])[0]
    platform_names = label_encoder.classes_
    probability_distribution = {platform_names[i]: float(probabilities[i]) for i in range(len(platform_names))}
    
    return best_platform, probability_distribution
