from django.http import JsonResponse
from django.db.models import Q

from bots.serializers import serializeBot

from .models import Game

# get all or single game
# /api/games or
# /api/games/<gameid>
def getGames(request, gameId=None):
    limit = request.GET.get("limit")
    offset = int(request.GET.get("offset", 0))
    getLatest = request.GET.get("latest") is not None
    botId = request.GET.get("botid")

    games = (Game.objects.select_related("white", "black", "winner").prefetch_related("moves"))

    # get single game
    if gameId is not None:
        games = games.filter(gameid = gameId)

    # get up to a limit and offset
    if limit is not None:
        limit = int(limit)
        games = games[offset:offset + limit]
    else:
        games = games[offset:]

    # get all games for a bot based on id
    if botId is not None:
        games = games.filter(
            Q(white__playerid=botId) |
            Q(black__playerid=botId)
        )

    # get latest
    if getLatest:
        games = games.order_by("-id")[:1]

    print("gets here")
    print(games)
    if len(games) == 0:
        return JsonResponse({"error": "Game not found"})

    results = []

    for game in games:
        moves = [
            {
                "id": move.id,
                "moveNum": move.moveNum,
                "move": move.move,
                "fen": move.fen
            }
            for move in game.moves.all()
        ]

        gameInfo = {
            "id": game.id,
            "gameid": str(game.gameid),
            "white": serializeBot(game.white),
            "black": serializeBot(game.black),
            "winner": serializeBot(game.winner) if game.winner is not None else None,
            "ongoing": game.winner is None and game.isDraw is False,
            "isDraw": game.isDraw,
            "timestamp": game.timestamp,
            "moves": moves
        }

        results.append(gameInfo)

    return JsonResponse(results, safe=False)

'''
def getAllGames(request):
    limit = request.GET.get("limit") if request.GET.get("limit") is not None else -1
    offset = request.GET.get("offset") if request.GET.get("offset") is not None else -1
    botId = request.GET.get("botid")

    query = "SELECT * FROM games WHERE whiteid = %s OR blackid = %s LIMIT %s OFFSET %s;"
    params = [botId, botId, limit, offset]

    if botId is None:
        query = "SELECT * FROM games LIMIT %s OFFSET %s;"
        params = [limit, offset]

    with connection.cursor() as cursor:
        cursor.execute(query, params)

        rows = cursor.fetchall()
        cols = [col[0] for col in cursor.description]

    gameData = [dict(zip(cols, row)) for row in rows]

    for game in gameData:
        botIds = [game.pop("whiteid"), game.pop("blackid")]

        for botId in botIds:
            with connection.cursor() as cursor:
                cursor.execute("SELECT name FROM bots WHERE playerid = %s ORDER BY id ASC LIMIT 1;", [botId])
                botName = cursor.fetchone()

                print(botName)

    returnData = {
        "results": [
            gameData
        ]
    }

    return JsonResponse(returnData, safe=False)

'''

def getGame(request, gameId):
    return JsonResponse({"ok": True})
