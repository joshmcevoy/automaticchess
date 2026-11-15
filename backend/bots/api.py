from django.http import JsonResponse

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
        botInfo = {
            "id": bot.id,
            "playerid": bot.playerid,
            "name": bot.name,
            "path": bot.path,
            "profilepicture": bot.profilepicture
        }

        results.append(botInfo)

    return JsonResponse(results, safe=False)
