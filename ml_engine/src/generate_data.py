import pandas as pd
import numpy as np
import os

def generate_adwise_dataset(num_rows=5000):
    """
    Generates a high-quality, realistic dataset for social media platform prediction.
    """
    np.random.seed(42)
    
    # Configuration
    industries = ['E-commerce', 'Tech', 'Fashion', 'Food', 'Services', 'Gaming']
    age_groups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
    goals = ['Awareness', 'Traffic', 'Conversion', 'Engagement']
    platforms = ['Facebook', 'Instagram', 'TikTok', 'Twitter']
    
    data = []

    for _ in range(num_rows):
        # 1. Randomly select platform based on realistic probability
        platform = np.random.choice(platforms)
        
        # 2. Logic-based feature generation
        industry = np.random.choice(industries)
        goal = np.random.choice(goals)
        budget = np.random.uniform(500, 50000) # Increased budget for realism
        
        # Adjust age group and engagement based on platform bias
        if platform == 'TikTok':
            age = np.random.choice(['13-17', '18-24', '25-34'], p=[0.4, 0.45, 0.15])
            engagement = np.random.normal(0.12, 0.03) # High engagement
        elif platform == 'Instagram':
            age = np.random.choice(['18-24', '25-34', '35-44'], p=[0.35, 0.45, 0.20])
            # Visual bias for Instagram
            if industry in ['Fashion', 'Food', 'Gaming']:
                engagement = np.random.normal(0.09, 0.02)
            else:
                engagement = np.random.normal(0.05, 0.02)
        elif platform == 'Facebook':
            age = np.random.choice(['35-44', '45-54', '55+'], p=[0.4, 0.35, 0.25])
            engagement = np.random.normal(0.025, 0.01)
        else: # Twitter
            # Tech/News bias for Twitter
            age = np.random.choice(age_groups)
            if industry in ['Tech', 'Services']:
                engagement = np.random.normal(0.06, 0.015)
            else:
                engagement = np.random.normal(0.03, 0.01)

        # 3. Derive metrics with correlated noise
        # impressions = budget * spread
        impressions = budget * np.random.normal(80, 15)
        
        # clicks = impressions * engagement
        clicks = impressions * (max(engagement, 0.001) + np.random.normal(0, 0.005))
        
        # conversions = clicks * conversion_rate (biased towards platform/industry)
        if platform in ['Instagram', 'TikTok']:
            conversion_rate = np.random.normal(0.10, 0.03)
        else:
            conversion_rate = np.random.normal(0.06, 0.02)
            
        conversions = clicks * max(conversion_rate, 0.005)
        
        # cpc = budget / clicks
        cpc = budget / max(clicks, 1)
        
        # Append structured row
        data.append({
            'budget': round(budget, 2),
            'industry': industry,
            'target_age_group': age,
            'campaign_goal': goal,
            'impressions': int(max(impressions, 0)),
            'clicks': int(max(clicks, 0)),
            'conversions': int(max(conversions, 0)),
            'engagement_rate': round(max(engagement, 0.001), 4),
            'cost_per_click': round(max(cpc, 0.01), 2),
            'best_platform': platform
        })

    df = pd.DataFrame(data)
    
    # Save the dataset
    save_path = os.path.join(os.path.dirname(__file__), '../data/raw/adwise_social_data.csv')
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    df.to_csv(save_path, index=False)
    
    return df

if __name__ == "__main__":
    df = generate_adwise_dataset()
    print(f"Generated {len(df)} rows.")
    print("Columns:", df.columns.tolist())
