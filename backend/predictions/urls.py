from django.urls import path
from .views import (
    PlatformPredictionView, 
    PredictionHistoryView, 
    DashboardStatsView,
    PredictionDetailView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView
)

urlpatterns = [
    # Platforms & Predictions
    path('predict/', PlatformPredictionView.as_view(), name='platform_predict'),
    path('predict', PlatformPredictionView.as_view()),
    
    path('history/', PredictionHistoryView.as_view(), name='prediction_history'),
    path('history', PredictionHistoryView.as_view()),
    
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('stats', DashboardStatsView.as_view()),
    
    path('history/<int:pk>/', PredictionDetailView.as_view(), name='prediction_detail'),
    path('history/<int:pk>', PredictionDetailView.as_view()),
    
    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications', NotificationListView.as_view()),
    
    path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('notifications/<int:pk>/read', NotificationMarkReadView.as_view()),
    
    path('notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
    path('notifications/mark-all-read', NotificationMarkAllReadView.as_view()),
]


