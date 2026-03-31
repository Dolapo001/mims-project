import os
import joblib
import pandas as pd
import numpy as np

# Resolve paths relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'model.pkl')
PREPROCESSOR_PATH = os.path.join(BASE_DIR, 'models', 'preprocessor.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.pkl')

def load_inference_artifacts():
    """
    Load model artifacts for prediction.
    """
    try:
        model = joblib.load(MODEL_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        return model, preprocessor, label_encoder
    except Exception as e:
        print(f"Error loading inference artifacts: {e}")
        return None, None, None

def predict(input_data):
    """
    Perform end-to-end prediction from raw dictionary input.
    Used for inference in production.
    
    Expected format:
    {
        'impressions': float,
        'clicks': float,
        'conversions': float,
        'spend': float,
        'engagement_rate': float
    }
    """
    model, preprocessor, label_encoder = load_inference_artifacts()
    
    if model is None:
        return {"error": "Inference artifacts not loaded."}

    # 1. Preprocess input
    # Convert dictionary to DataFrame for the preprocessor
    df = pd.DataFrame([input_data])
    X_processed = preprocessor.transform(df)

    # 2. Run Prediction
    prediction_idx = model.predict(X_processed)[0]
    probabilities = model.predict_proba(X_processed)[0]

    # 3. Format Results
    best_platform = label_encoder.inverse_transform([prediction_idx])[0]
    platform_names = label_encoder.classes_
    
    return {
        "best_platform": best_platform,
        "probabilities": {platform_names[i]: float(probabilities[i]) for i in range(len(platform_names))}
    }

if __name__ == "__main__":
    # Example usage:
    test_data = {
        'impressions': 15000,
        'clicks': 800,
        'conversions': 80,
        'spend': 350,
        'engagement_rate': 0.053
    }
    result = predict(test_data)
    print("Inference Result:", result)
