from django.http import JsonResponse
from django.db import connection

# get game info
# game based on id
# all games
# all moves in a game
def getGameInfo(request, info):
    gameId = request.GET.get("gameid")

    query = ""
    params = [gameId]
    # TODO: update to python 3.10+ so this match statement works. ugly if elif in the meantime
    if info == "get":
        query = "SELECT * FROM games WHERE gameid = %s;"
    elif info == "getlatest":
        query = "SELECT * FROM games ORDER BY id DESC limit 1;"
        params = []
    elif info == "moves":
        query = "SELECT * FROM moves WHERE gameid = %s;"
    elif info == "getall":
        query = "SELECT * FROM games;"
        params = []

    '''
    match info:
        case "get":
            query = f"SELECT * FROM games WHERE id = {0};".format(gameId)
        case "moves":
            query = f"SELECT * FROM moves WHERE gameid = {0};".format(gameId)
        case "getall":
            query = "SELECT * FROM games;"
    '''

    if not query:
        return JsonResponse({"error": "Invalid arguments"}, status=404)

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        cols = [col[0] for col in cursor.description]
        results = [dict(zip(cols, row)) for row in rows]

    if not rows:
        return JsonResponse({"error": "Game not found"}, status=404)

    return JsonResponse(results, safe=False)
