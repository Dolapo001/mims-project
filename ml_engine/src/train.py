import os
import joblib
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from preprocessing import load_and_preprocess

def get_base_estimators():
    """
    Returns the collection of algorithms for base-layer stacking.
    """
    return [
        ('dt', DecisionTreeClassifier(random_state=42)),
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
        ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ('svm', SVC(kernel='linear', probability=True, random_state=42))
    ]

def train_stacking_ensemble(X_train, y_train):
    """
    Constructs and fits a Random Forest model for faster training.
    """
    print("\n--- Initializing Random Forest Model ---")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)

    print("Fitting Model (this is much faster)...")
    model.fit(X_train, y_train)
    
    return model

def evaluate_performance(model, X_test, y_test, label_encoder):
    """
    Evaluates the model on test data across core classification metrics.
    """
    y_pred = model.predict(X_test)
    
    # Calculate detailed metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    # Print results
    print("\n--- FINAL MODEL EVALUATION ---")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f} (weighted)")
    print(f"Recall:    {recall:.4f} (weighted)")
    print(f"F1-Score:  {f1:.4f} (weighted)")
    
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    return accuracy, precision, recall, f1

def save_model(model, filename='models/model.pkl'):
    """
    Serializes the final trained stacking model as a pkl artifact.
    """
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    joblib.dump(model, filename)
    print(f"\n✅ Final Stacking Ensemble saved to: {filename}")

if __name__ == "__main__":
    # Execution Path
    DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/raw/adwise_social_data.csv')
    
    try:
        # 1. Load and Run Preprocessing Pipeline
        print(f"Processing data from {DATA_PATH}...")
        X_train, X_test, y_train, y_test, preprocessor, label_encoder = load_and_preprocess(DATA_PATH)
        
        # 2. Train the Stacking Ensemble
        stacking_model = train_stacking_ensemble(X_train, y_train)
        
        # 3. Evaluate results
        evaluate_performance(stacking_model, X_test, y_test, label_encoder)
        
        # 4. Save artifacts for backend inference
        save_model(stacking_model)
        
    except Exception as e:
        print(f"Error during training pipeline execution: {e}")
