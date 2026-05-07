import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def train_adwise_model():
    data_path = "ml_engine/data/processed/master_training_data.csv"
    if not os.path.exists(data_path):
        print(f"❌ Error: Master dataset not found at {data_path}")
        return

    # Load Data
    df = pd.read_csv(data_path)
    
    # Feature Engineering
    X = df[['budget', 'industry', 'target_age_group', 'campaign_goal', 'engagement_rate']]
    y = df['best_platform']
    
    # Encoding categorical features
    le_industry = LabelEncoder()
    le_age = LabelEncoder()
    le_goal = LabelEncoder()
    le_platform = LabelEncoder()
    
    X = X.copy()
    X['industry'] = le_industry.fit_transform(X['industry'])
    X['target_age_group'] = le_age.fit_transform(X['target_age_group'])
    X['campaign_goal'] = le_goal.fit_transform(X['campaign_goal'])
    y = le_platform.fit_transform(y)
    
    # Save encoders for inference
    encoders = {
        'industry': le_industry,
        'target_age_group': le_age,
        'campaign_goal': le_goal,
        'best_platform': le_platform
    }
    joblib.dump(encoders, 'ml_engine/models/encoders.joblib')

    # Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 1. Define Sub-Models
    clf1 = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf2 = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    clf3 = LogisticRegression(max_iter=1000, random_state=42)

    # 2. Build the Ensemble (Soft Voting)
    ensemble = VotingClassifier(
        estimators=[
            ('rf', clf1),
            ('gb', clf2),
            ('lr', clf3)
        ],
        voting='soft',
        weights=[2, 2, 1] # Giving more weight to Tree-based models
    )

    # 3. Create Training Pipeline (Scaling + Model)
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('ensemble', ensemble)
    ])

    # Train
    print("🚀 Training Soft Voting Ensemble...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    score = pipeline.score(X_test, y_test)
    print(f"✅ Training Complete. Model Accuracy: {score:.2%}")

    # Save Model
    joblib.dump(pipeline, 'ml_engine/models/adwise_platform_model.joblib')
    print("💾 Model saved to ml_engine/models/adwise_platform_model.joblib")

if __name__ == "__main__":
    train_adwise_model()
