from django.http import JsonResponse
from .serializers import serializeBot
from .models import Bot

# get all or single game
# /api/bots or
# /api/bots/<botid>
def getBot(request, botId=None):

    bots = (Bot.objects.all())

    if botId is not None:
        bots = bots.filter(playerid = botId)

    results = []

    for bot in bots:
        results.append(serializeBot(bot))

    return JsonResponse(results, safe=False)
