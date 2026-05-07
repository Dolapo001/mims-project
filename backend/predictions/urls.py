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
    path('predict/', PlatformPredictionView.as_view(), name='platform_predict'),
    path('history/', PredictionHistoryView.as_view(), name='prediction_history'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('history/<int:pk>/', PredictionDetailView.as_view(), name='prediction_detail'),
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
]

