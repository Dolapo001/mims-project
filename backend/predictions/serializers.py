from rest_framework import serializers
from .models import PredictionRecord, Notification

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


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    time = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ('id', 'text', 'unread', 'time')

    def get_time(self, obj):
        # Format the time nicely for the frontend (e.g. "2 min ago", "1 hr ago", "Yesterday" or standard date)
        from django.utils.timezone import now
        diff = now() - obj.created_at
        
        if diff.days == 0:
            seconds = diff.seconds
            if seconds < 60:
                return "Just now"
            minutes = seconds // 60
            if minutes < 60:
                return f"{minutes} min ago" if minutes > 1 else "1 min ago"
            hours = minutes // 60
            return f"{hours} hr ago" if hours > 1 else "1 hr ago"
        elif diff.days == 1:
            return "Yesterday"
        elif diff.days < 7:
            return f"{diff.days} days ago"
        else:
            return obj.created_at.strftime("%b %d")

