from django.urls import path
from .views import RegisterView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('register', RegisterView.as_view()),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile', ProfileView.as_view()),
]

