from django.db import models
from django.contrib.auth.models import User

class PredictionRecord(models.Model):
    """
    Persistent log of AdWise AI predictions for historical analysis.
    Links to the user who requested the analysis.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')
    
    # Input Metrics
    budget = models.FloatField()
    industry = models.CharField(max_length=50)
    target_age_group = models.CharField(max_length=50)
    campaign_goal = models.CharField(max_length=50)
    
    # Performance Features (Meta)
    impressions = models.IntegerField()
    clicks = models.IntegerField()
    conversions = models.IntegerField()
    engagement_rate = models.FloatField()
    cost_per_click = models.FloatField()
    
    # AI Output Results
    best_platform = models.CharField(max_length=50)
    confidence = models.FloatField()
    ranking_data = models.JSONField(default=list)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} | {self.industry} | {self.best_platform} ({self.created_at.date()})"
