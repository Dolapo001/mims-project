import sys
import os
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from preprocessing import load_and_preprocess
from train import get_base_estimators, train_stacking_ensemble

def main():
    print("Loading data...")
    DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/raw/adwise_social_data.csv')
    X_train, X_test, y_train, y_test, preprocessor, label_encoder = load_and_preprocess(DATA_PATH)
    
    models = get_base_estimators()
    results = {}
    
    print("Training base models...")
    for name, model in models:
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        results[name] = acc
        print(f"{name} accuracy: {acc:.4f}")
        
    print("Training Stacking Ensemble...")
    ensemble = train_stacking_ensemble(X_train, y_train)
    y_pred_ens = ensemble.predict(X_test)
    acc_ens = accuracy_score(y_test, y_pred_ens)
    results['Stacking Ensemble'] = acc_ens
    print(f"Ensemble accuracy: {acc_ens:.4f}")
    
    # Plotting
    names = list(results.keys())
    accuracies = list(results.values())
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(names, accuracies, color=['skyblue', 'lightgreen', 'salmon', 'gold', 'mediumpurple'])
    plt.ylabel('Accuracy')
    plt.title('Model Accuracies Comparison')
    plt.ylim(0, 1.0)
    
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 0.01, round(yval, 4), ha='center', va='bottom')
        
    artifact_dir = '/home/adedolapo/AntigravityProfiles/clients/.gemini/antigravity/brain/4e52c398-a08f-40e8-a9d6-5bc6325c22b2'
    plt.savefig(os.path.join(artifact_dir, 'model_accuracies.png'))
    print("Saved plot to artifact directory")

if __name__ == "__main__":
    main()
