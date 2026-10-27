from django.urls import path
from . import views

# bots/
urlpatterns = [
    path("logs/<str:bot>", views.getBotOutput),
    path("get/", views.getBot),
    path("eval/", views.getEval)
]
