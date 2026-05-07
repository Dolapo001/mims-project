#!/bin/bash

# Ensure Kaggle directory exists
mkdir -p ~/.kaggle

# Support for the new KAGGLE_API_TOKEN format provided by user
if [ -n "$KAGGLE_API_TOKEN" ]; then
    echo "🔑 Using KAGGLE_API_TOKEN for authentication..."
    export KAGGLE_CONFIG_DIR=$(pwd)/.kaggle_config
    mkdir -p $KAGGLE_CONFIG_DIR
    # Note: Depending on the kaggle tool version, this might need different handling.
    # We will pass the token in the environment.
else
    chmod 600 ~/.kaggle/kaggle.json
fi

echo "🚀 Starting Dataset Downloads..."

# 1. Manisha Bhatt (200k rows)
echo "📥 Downloading Manisha Bhatt Marketing Dataset..."
kaggle datasets download manishabhatt22/marketing-campaign-performance-dataset -p ml_engine/data/raw/kaggle/manisha --unzip

# 2. Facebook Ad Campaign (loveall)
echo "📥 Downloading Facebook Real-world Ads Dataset..."
kaggle datasets download madislemsalu/facebook-ad-campaign -p ml_engine/data/raw/kaggle/loveall --unzip

# 3. Social Media Ads (jsonk11)
echo "📥 Downloading Social Media Advertising Dataset..."
kaggle datasets download jsonk11/social-media-advertising-dataset -p ml_engine/data/raw/kaggle/jsonk --unzip

echo "✅ All datasets downloaded and extracted to ml_engine/data/raw/kaggle/"
echo "👉 Now run: python3 ml_engine/src/merge_datasets.py"
