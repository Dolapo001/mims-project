import os
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from django.conf import settings

class PredictionService:
    """
    Dedicated Service Layer for ML Inference in the AdWise AI system.
    Decouples Django REST API from Machine Learning implementation.
    """
    
    _model = None
    _preprocessor = None
    _label_encoder = None

    @classmethod
    def _get_artifacts_path(cls):
        """Resolves path to the sister ml_engine artifacts directory."""
        return Path(settings.BASE_DIR).parent / 'ml_engine' / 'models'

    @classmethod
    def _load_artifacts(cls):
        """Loads and caches ML artifacts (Singleton approach for performance)."""
        if cls._model is None:
            path = cls._get_artifacts_path()
            try:
                cls._model = joblib.load(str(path / 'model.pkl'))
                cls._preprocessor = joblib.load(str(path / 'preprocessor.pkl'))
                cls._label_encoder = joblib.load(str(path / 'label_encoder.pkl'))
            except Exception as e:
                print(f"Critcal Error loading ML artifacts: {e}")
                raise RuntimeError("Failed to initialize Prediction Engine.")
        
        return cls._model, cls._preprocessor, cls._label_encoder

    @classmethod
    def predict_campaign(cls, data):
        """
        Takes raw dictionary input and returns a complete prediction result.
        
        Return signature:
        {
            "best_platform": str,
            "confidence": float,
            "ranking": [
                {"platform": str, "probability": float},
                ...
            ]
        }
        """
        # 1. Ensure artifacts are ready
        model, preprocessor, label_encoder = cls._load_artifacts()
        
        # 2. Convert input JSON → DataFrame
        df = pd.DataFrame([data])
        
        # 3. Apply preprocessing (ColumnTransformer)
        X_processed = preprocessor.transform(df)
        
        # 4. Run model inference (predict_proba)
        # StackingClassifier returns probabilities for each class
        probabilities = model.predict_proba(X_processed)[0]
        
        # 5. Extract meta-data and ranking
        platform_names = label_encoder.classes_
        
        # Best prediction
        best_idx = np.argmax(probabilities)
        best_platform = platform_names[best_idx]
        confidence = float(probabilities[best_idx])
        
        # Full Ranking
        ranking = []
        for i, name in enumerate(platform_names):
            ranking.append({
                "platform": name,
                "probability": round(float(probabilities[i]), 4)
            })
        
        # Sort ranking by probability (highest first)
        ranking = sorted(ranking, key=lambda x: x['probability'], reverse=True)
        
        return {
            "best_platform": best_platform,
            "confidence": round(confidence, 4),
            "ranking": ranking
        }
