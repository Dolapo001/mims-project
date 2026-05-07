import pandas as pd
import numpy as np
import os

def generate_adwise_dataset(num_rows=5000):
    """
    Generates a high-quality, realistic dataset for social media platform prediction.
    """
    np.random.seed(42)
    
    # Configuration
    industries = ['E-commerce', 'Tech', 'Fashion', 'Food', 'Services', 'Gaming', 
                  'Travel', 'Real Estate', 'Education', 'Healthcare', 'Automotive']
    age_groups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
    goals = ['Awareness', 'Traffic', 'Conversion', 'Engagement', 'Lead Generation']
    platforms = ['Facebook', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Pinterest', 'YouTube Shorts']
    
    data = []

    for _ in range(num_rows):
        # 1. Randomly select platform based on realistic probability
        platform = np.random.choice(platforms)
        
        # 2. Logic-based feature generation
        industry = np.random.choice(industries)
        goal = np.random.choice(goals)
        budget = np.random.uniform(500, 50000)
        
        # Adjust age group and engagement based on platform bias
        if platform == 'TikTok' or platform == 'YouTube Shorts':
            age = np.random.choice(['13-17', '18-24', '25-34'], p=[0.4, 0.45, 0.15])
            engagement = np.random.normal(0.11, 0.035) # High engagement for short-form video
        elif platform == 'Instagram':
            age = np.random.choice(['18-24', '25-34', '35-44'], p=[0.35, 0.45, 0.20])
            if industry in ['Fashion', 'Food', 'Travel', 'Gaming']:
                engagement = np.random.normal(0.09, 0.02)
            else:
                engagement = np.random.normal(0.05, 0.02)
        elif platform == 'Facebook':
            age = np.random.choice(['35-44', '45-54', '55+'], p=[0.4, 0.35, 0.25])
            engagement = np.random.normal(0.025, 0.01)
        elif platform == 'LinkedIn':
            age = np.random.choice(['25-34', '35-44', '45-54'], p=[0.4, 0.4, 0.2])
            if industry in ['Tech', 'Services', 'Education', 'Real Estate']:
                engagement = np.random.normal(0.04, 0.015)
            else:
                engagement = np.random.normal(0.02, 0.01)
        elif platform == 'Pinterest':
            age = np.random.choice(['25-34', '35-44', '45-54'], p=[0.3, 0.5, 0.2])
            if industry in ['Fashion', 'Food', 'Travel', 'E-commerce']:
                engagement = np.random.normal(0.07, 0.02)
            else:
                engagement = np.random.normal(0.03, 0.01)
        else: # Twitter/X
            age = np.random.choice(age_groups)
            if industry in ['Tech', 'Services', 'Gaming']:
                engagement = np.random.normal(0.06, 0.015)
            else:
                engagement = np.random.normal(0.03, 0.01)

        # 3. Derive metrics with correlated noise
        impressions = budget * np.random.normal(85, 15)
        clicks = impressions * (max(engagement, 0.001) + np.random.normal(0, 0.005))
        
        # conversions = clicks * conversion_rate
        if platform == 'LinkedIn':
            conversion_rate = np.random.normal(0.08, 0.02) # Higher value leads
        elif platform in ['Instagram', 'TikTok', 'YouTube Shorts']:
            conversion_rate = np.random.normal(0.12, 0.04)
        else:
            conversion_rate = np.random.normal(0.06, 0.02)
            
        conversions = clicks * max(conversion_rate, 0.005)
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
    import argparse
    parser = argparse.ArgumentParser(description='Generate synthetic campaign data.')
    parser.add_argument('--rows', type=int, default=15000, help='Number of rows to generate')
    parser.add_argument('--output', type=str, help='Path to save the CSV file')
    
    args = parser.parse_args()
    
    # If output is specified, we can override the default in the function logic or just call it here
    # For now, let's just use the rows argument
    df = generate_adwise_dataset(num_rows=args.rows)
    print(f"Generated {len(df)} rows.")
    print("Columns:", df.columns.tolist())
