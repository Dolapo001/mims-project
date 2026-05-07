import pandas as pd
import numpy as np
import os
import glob

# Ensure directories exist
RAW_DIR = "ml_engine/data/raw"
KAG_DIR = os.path.join(RAW_DIR, "kaggle")
PROCESSED_DIR = "ml_engine/data/processed"
os.makedirs(KAG_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Canonical Schema for AdWise Engine
CANONICAL_COLUMNS = [
    'budget', 'industry', 'target_age_group', 'campaign_goal',
    'impressions', 'clicks', 'conversions', 'engagement_rate', 'best_platform'
]

def map_manisha_data(file_pattern="**/marketing-campaign-performance-dataset/*.csv"):
    """Maps Manisha's 200k synthetic rows with industry-to-category conversion."""
    files = glob.glob(os.path.join(KAG_DIR, file_pattern), recursive=True)
    if not files: return None
    
    print(f"Reading Manisha data from {files[0]}...")
    df = pd.read_csv(files[0])
    
    mapped = pd.DataFrame()
    # Normalize Budget
    mapped['budget'] = df['Amount Spent'] if 'Amount Spent' in df else df.get('Budget', 1000)
    
    # Map high-level segments to our specific industries
    industry_map = {
        'Fashionistas': 'Fashion', 
        'Foodies': 'Food', 
        'Tech Enthusiasts': 'Tech',
        'Gamers': 'Gaming', 
        'Travelers': 'Travel', 
        'Fitness': 'Healthcare',
        'Home Decor': 'Real Estate'
    }
    mapped['industry'] = df['Target Audience'].map(industry_map).fillna('E-commerce')
    
    mapped['target_age_group'] = '25-44' # Default for this set
    mapped['campaign_goal'] = 'Engagement' # Proxy
    mapped['impressions'] = df['Impressions']
    mapped['clicks'] = df['Clicks']
    
    # Convert % string or float to decimal count
    if 'Conversion Rate' in df:
        conv_rate = df['Conversion Rate'].astype(float) / 100
        mapped['conversions'] = (df['Clicks'] * conv_rate).astype(int)
    else:
        mapped['conversions'] = (df['Clicks'] * 0.05).astype(int)
        
    mapped['engagement_rate'] = (df['Engagement Score'] / 10).clip(0, 1) # Normalize
    
    # Standardize Platform Name
    mapped['best_platform'] = df['Channel'].replace({
        'Social Media': 'Instagram',
        'Search': 'Facebook', # Bridging broad categories
        'Email': 'TikTok',
        'Display': 'LinkedIn'
    })
    
    return mapped[CANONICAL_COLUMNS]

def map_loveall_facebook(file_pattern="**/kaggle-facebook-ads/*.csv"):
    """Maps real FB campaign data with demographic slicing."""
    files = glob.glob(os.path.join(KAG_DIR, file_pattern), recursive=True)
    if not files: return None
    
    print(f"Reading Loveall data from {files[0]}...")
    df = pd.read_csv(files[0])
    
    mapped = pd.DataFrame()
    mapped['budget'] = df['Spent']
    mapped['industry'] = 'E-commerce'
    mapped['target_age_group'] = df['age']
    mapped['campaign_goal'] = 'Conversion'
    mapped['impressions'] = df['Impressions']
    mapped['clicks'] = df['Clicks']
    mapped['conversions'] = df['Total_Conversion']
    mapped['engagement_rate'] = (df['Clicks'] / df['Impressions']).fillna(0)
    mapped['best_platform'] = 'Facebook'
    
    return mapped[CANONICAL_COLUMNS]

def merge_and_save():
    """Main execution: Load, Map, Merge, and Normalize."""
    dfs = []
    
    # 1. Load Local AdWise Synthetic Data (Our Gold Standard)
    base_file = os.path.join(RAW_DIR, "adwise_social_data.csv")
    if os.path.exists(base_file):
        print("Adding base AdWise data...")
        dfs.append(pd.read_csv(base_file))
    
    # 2. Extract and Map external Kaggle sources
    manisha = map_manisha_data()
    if manisha is not None: dfs.append(manisha)
    
    loveall = map_loveall_facebook()
    if loveall is not None: dfs.append(loveall)
    
    if not dfs:
        print("❌ No data found to merge! Please download Kaggle sets first.")
        return
    
    # 3. Concatenate (The Merge)
    combined_df = pd.concat(dfs, ignore_index=True)
    
    # 4. Final Data Integrity Pass (Cleaning the "Tight" results)
    combined_df['industry'] = combined_df['industry'].str.strip().str.title()
    combined_df['budget'] = combined_df['budget'].round(2)
    combined_df['best_platform'] = combined_df['best_platform'].fillna('Instagram')
    
    # Remove outliers or bad data
    combined_df = combined_df[combined_df['impressions'] > 0]
    
    # 5. Export
    output_path = os.path.join(PROCESSED_DIR, "master_training_data.csv")
    combined_df.to_csv(output_path, index=False)
    
    print(f"\n✅ MERGE COMPLETE")
    print(f"------------------")
    print(f"Final Count: {len(combined_df)} rows")
    print(f"Saved to:    {output_path}")

if __name__ == "__main__":
    merge_and_save()
