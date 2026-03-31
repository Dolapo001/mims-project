import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

def get_preprocessor(numeric_features, categorical_features):
    """
    Creates a production-ready ColumnTransformer for disparate feature types.
    """
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    return preprocessor

def load_and_preprocess(filepath, target_col='best_platform'):
    """
    Loads raw CSV and applies ColumnTransformer based on schema.
    """
    df = pd.read_csv(filepath)
    
    numeric_features = [
        'budget', 'impressions', 'clicks', 'conversions', 
        'engagement_rate', 'cost_per_click'
    ]
    categorical_features = ['industry', 'target_age_group', 'campaign_goal']
    
    X = df[numeric_features + categorical_features]
    y = df[target_col]
    
    # Target Encoding
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Model Export (Partial for tracking)
    os.makedirs('models', exist_ok=True)
    joblib.dump(label_encoder, 'models/label_encoder.pkl')
    
    # Define and fit preprocessor
    preprocessor = get_preprocessor(numeric_features, categorical_features)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    joblib.dump(preprocessor, 'models/preprocessor.pkl')
    
    return X_train_processed, X_test_processed, y_train, y_test, preprocessor, label_encoder
