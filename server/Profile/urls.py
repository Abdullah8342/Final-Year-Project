from django.urls import path
from .views import ProfileView,ProfileDetailsView

urlpatterns = [
    path('',ProfileView.as_view(),name='profile'),
    path('<int:pk>/',ProfileDetailsView.as_view(),name='profile-view')
]
