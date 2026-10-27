from django.urls import path
from . import views

# games/
urlpatterns = [
    path("<str:info>/", views.getGameInfo),
]
