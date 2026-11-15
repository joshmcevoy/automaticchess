from django.contrib import admin
from django.urls import include, path
from games import api as gameapi
from bots import api as botapi
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/games", gameapi.getGames),
    path("api/games/<str:gameId>", gameapi.getGames),
    path("api/bots", botapi.getBot),
    path("api/bots/<str:botId>", botapi.getBot)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
