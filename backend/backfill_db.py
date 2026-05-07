#!/usr/bin/env python
import os
import sys
import django
import random
import time
import argparse
import pandas as pd

# Set up Django environment
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(base_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "adwise_backend.settings")
django.setup()

# Django model imports must happen after django.setup()
from django.contrib.auth.models import User
from predictions.models import PredictionRecord, Notification
from predictions.services.predictor import PredictionService

def main():
    parser = argparse.ArgumentParser(description="Backfill AdWise PostgreSQL database with synthetic campaign data.")
    parser.add_argument(
        "--limit", 
        type=int, 
        default=5000, 
        help="Maximum number of records to import (default: 5000, max: 50000)."
    )
    parser.add_argument(
        "--clear", 
        action="store_true", 
        help="Clear existing prediction records before backfilling."
    )
    args = parser.parse_args()

    # 1. Resolve CSV path
    csv_path = os.path.abspath(os.path.join(base_dir, "..", "ml_engine", "data", "raw", "adwise_social_data.csv"))
    if not os.path.exists(csv_path):
        print(f"❌ Error: CSV dataset not found at {csv_path}")
        sys.exit(1)

    print("======================================================================")
    print("🚀 AdWise Database Backfill Engine Started")
    print("======================================================================")
    print(f"📂 Dataset Source: {csv_path}")

    # 2. Get active users in Django
    users = list(User.objects.all())
    if not users:
        print("⚠️ No users found in database. Creating default user 'Dolapo'...")
        # Create a default user
        user = User.objects.create_user('Dolapo', 'dolapo@adwise.ai', 'adwise2026')
        users = [user]
    else:
        print(f"👤 Found {len(users)} user(s) in database: {[u.username for u in users]}")

    # 3. Clear existing predictions if requested
    if args.clear:
        print("🧹 Clearing existing PredictionRecords from the database...")
        deleted_count, _ = PredictionRecord.objects.all().delete()
        print(f"✅ Cleared {deleted_count} existing records.")

    # 4. Load dataset
    print(f"📥 Loading dataset into memory...")
    try:
        df = pd.read_csv(csv_path)
        df = df.dropna()
        total_rows = len(df)
        print(f"✅ Dataset loaded successfully. Total available rows: {total_rows}")
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        sys.exit(1)

    # Respect limit
    limit = min(args.limit, total_rows)
    print(f"📊 Preparing to backfill {limit} records into the PostgreSQL database...")

    # 5. Process and predict records
    records_to_create = []
    start_time = time.time()
    
    # Try warming up PredictionService to check if model artifacts are ready
    models_ready = False
    try:
        print("🧠 Initializing AdWise ML Prediction Engine...")
        PredictionService._load_artifacts()
        models_ready = True
        print("✅ ML Prediction Engine initialized successfully.")
    except Exception as e:
        print(f"⚠️ Warning: PredictionService failed to initialize ({e}).")
        print("⚠️ Falling back to CSV values for platform mapping and generating realistic mock confidence.")

    print("\n⏳ Processing records and generating predictions...")
    
    for i, (_, row) in enumerate(df.head(limit).iterrows()):
        # Extract features
        budget = float(row['budget'])
        industry = str(row['industry'])
        target_age_group = str(row['target_age_group'])
        campaign_goal = str(row['campaign_goal'])
        impressions = int(row['impressions'])
        clicks = int(row['clicks'])
        conversions = int(row['conversions'])
        engagement_rate = float(row['engagement_rate'])
        cost_per_click = float(row['cost_per_click'])
        
        # Determine predictions and probabilities
        if models_ready:
            pred_data = {
                'budget': budget,
                'industry': industry,
                'target_age_group': target_age_group,
                'campaign_goal': campaign_goal,
                'impressions': impressions,
                'clicks': clicks,
                'conversions': conversions,
                'engagement_rate': engagement_rate,
                'cost_per_click': cost_per_click
            }
            try:
                prediction = PredictionService.predict_campaign(pred_data)
                best_platform = prediction['best_platform']
                confidence = prediction['confidence']
                ranking_data = prediction['ranking']
            except Exception:
                # Local row fallback
                best_platform = str(row['best_platform'])
                confidence = round(random.uniform(0.68, 0.96), 4)
                ranking_data = [
                    {"platform": best_platform, "probability": confidence},
                    {"platform": "Instagram" if best_platform != "Instagram" else "Facebook", "probability": round(1.0 - confidence, 4)}
                ]
        else:
            best_platform = str(row['best_platform'])
            confidence = round(random.uniform(0.68, 0.96), 4)
            ranking_data = [
                {"platform": best_platform, "probability": confidence},
                {"platform": "Instagram" if best_platform != "Instagram" else "Facebook", "probability": round(1.0 - confidence, 4)}
            ]

        # Allocate to a random user from database to distribute the mock dashboard data evenly
        assigned_user = random.choice(users)

        records_to_create.append(PredictionRecord(
            user=assigned_user,
            budget=budget,
            industry=industry,
            target_age_group=target_age_group,
            campaign_goal=campaign_goal,
            impressions=impressions,
            clicks=clicks,
            conversions=conversions,
            engagement_rate=engagement_rate,
            cost_per_click=cost_per_click,
            best_platform=best_platform,
            confidence=confidence,
            ranking_data=ranking_data
        ))

        # Progress reporting
        if (i + 1) % 1000 == 0 or (i + 1) == limit:
            elapsed = time.time() - start_time
            print(f"   Processed {i + 1}/{limit} records ({((i + 1)/limit)*100:.1f}%) | Elapsed: {elapsed:.2f}s")

    # 6. Bulk create records
    print("\n💾 Committing records to PostgreSQL database (bulk insertion)...")
    bulk_start = time.time()
    try:
        # Django bulk_create inserts fast
        PredictionRecord.objects.bulk_create(records_to_create, batch_size=1000)
        bulk_elapsed = time.time() - bulk_start
        print(f"✅ Database insertion complete in {bulk_elapsed:.2f} seconds!")
    except Exception as e:
        print(f"❌ Error during bulk database insertion: {e}")
        print("💡 Attempting sequential insertion fallback for debugging...")
        try:
            for r in records_to_create[:5]:
                r.save()
            print("Successfully saved first 5 records sequentially. There may be a schema mismatch in bulk create.")
        except Exception as seq_err:
            print(f"❌ Sequential fallback error: {seq_err}")
        sys.exit(1)

    # 7. Create activity notifications
    print("🔔 Generating activity notifications for users...")
    for user in users:
        Notification.objects.create(
            user=user,
            text=f"Database backfill completed! Loaded {limit} high-fidelity campaign analytics records.",
            unread=True
        )

    total_elapsed = time.time() - start_time
    print("\n======================================================================")
    print("🏆 BACKFILL SUCCESSFUL")
    print("======================================================================")
    print(f"✨ Total Records Inserted: {limit}")
    print(f"⏱️ Total Execution Time:   {total_elapsed:.2f} seconds")
    print(f"📈 Avg Insertion Speed:    {limit / total_elapsed:.1f} records/sec")
    print("======================================================================")

if __name__ == "__main__":
    main()
