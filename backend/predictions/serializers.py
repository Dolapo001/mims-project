from rest_framework import serializers
from .models import PredictionRecord

class AdWisePredictionSerializer(serializers.Serializer):
    """
    Serializer for the AdWise AI Platform Prediction input.
    Validates all mandatory campaign metrics and metadata.
    """
    budget = serializers.FloatField(required=True, min_value=0)
    impressions = serializers.IntegerField(required=True, min_value=0)
    clicks = serializers.IntegerField(required=True, min_value=0)
    conversions = serializers.IntegerField(required=True, min_value=0)
    engagement_rate = serializers.FloatField(required=True, min_value=0, max_value=1.0)
    cost_per_click = serializers.FloatField(required=True, min_value=0)

    industry = serializers.ChoiceField(
        choices=['E-commerce', 'Tech', 'Fashion', 'Food', 'Services', 'Gaming'],
        required=True
    )
    target_age_group = serializers.ChoiceField(
        choices=['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
        required=True
    )
    campaign_goal = serializers.ChoiceField(
        choices=['Awareness', 'Traffic', 'Conversion', 'Engagement'],
        required=True
    )

    def validate(self, data):
        if data['clicks'] > data['impressions']:
            raise serializers.ValidationError("Clicks cannot exceed total impressions.")
        return data

class PredictionHistorySerializer(serializers.ModelSerializer):
    """
    Comprehensive Serializer for historical analysis.
    Exposes input features and AI output ranking for detail views.
    """
    date = serializers.DateTimeField(source='created_at', format="%Y-%m-%d")
    result = serializers.CharField(source='best_platform')
    ranking = serializers.JSONField(source='ranking_data')

    class Meta:
        model = PredictionRecord
        fields = (
            'id', 'date', 'industry', 'budget', 'result', 'confidence', 
            'campaign_goal', 'target_age_group', 'impressions', 'clicks', 
            'conversions', 'engagement_rate', 'cost_per_click', 'ranking'
        )
