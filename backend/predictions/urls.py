from django.urls import path
from .views import (
    PlatformPredictionView, 
    PredictionHistoryView, 
    DashboardStatsView,
    PredictionDetailView
)

urlpatterns = [
    path('predict/', PlatformPredictionView.as_view(), name='platform_predict'),
    path('history/', PredictionHistoryView.as_view(), name='prediction_history'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('history/<int:pk>/', PredictionDetailView.as_view(), name='prediction_detail'),
]
