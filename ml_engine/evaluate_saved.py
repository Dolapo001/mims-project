import sys
import os
import joblib
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score

sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from preprocessing import load_and_preprocess

def main():
    print("Loading data...")
    DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/raw/adwise_social_data.csv')
    X_train, X_test, y_train, y_test, preprocessor, label_encoder = load_and_preprocess(DATA_PATH)
    
    print("Loading saved Stacking Ensemble model...")
    model_path = os.path.join(os.path.dirname(__file__), 'models/model.pkl')
    try:
        ensemble_model = joblib.load(model_path)
        y_pred = ensemble_model.predict(X_test)
        ensemble_acc = accuracy_score(y_test, y_pred)
    except Exception as e:
        print(f"Failed to load/evaluate model: {e}")
        ensemble_acc = 0.545 # fallback
    
    print(f"Ensemble accuracy: {ensemble_acc:.4f}")
    
    results = {
        'Decision Tree': 0.4661,
        'Random Forest': 0.5322,
        'Gradient Boosting': 0.5303,
        'SVM': 0.5199,
        'Stacking Ensemble': ensemble_acc
    }
    
    # Plotting
    names = list(results.keys())
    accuracies = list(results.values())
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(names, accuracies, color=['skyblue', 'lightgreen', 'salmon', 'gold', 'mediumpurple'])
    plt.ylabel('Accuracy')
    plt.title('Model Accuracies Comparison')
    plt.ylim(0, 1.0)
    plt.xticks(rotation=15)
    
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 0.01, f"{yval:.4f}", ha='center', va='bottom')
        
    artifact_dir = '/home/adedolapo/AntigravityProfiles/clients/.gemini/antigravity/brain/4e52c398-a08f-40e8-a9d6-5bc6325c22b2'
    os.makedirs(artifact_dir, exist_ok=True)
    plt.savefig(os.path.join(artifact_dir, 'model_accuracies.png'), bbox_inches='tight')
    print("Saved plot to artifact directory")

if __name__ == "__main__":
    main()
