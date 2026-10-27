from django.http import JsonResponse, HttpResponse
from django.db import connection
from stockfish import Stockfish
from pathlib import Path

def getBotOutput(request, bot):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM botlogs WHERE name = %s", [bot])
        rows = cursor.fetchall()

    return JsonResponse(rows, safe=False, json_dumps_params={"indent": 4})

def getBot(request):
    botId = request.GET.get("botid")

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM bots WHERE playerid = %s", [botId])
        rows = cursor.fetchall()
        cols = [col[0] for col in cursor.description]
        results = [dict(zip(cols, row)) for row in rows]

    if rows is None:
        return JsonResponse({"error": "Bot not found"}, status=404)

    return JsonResponse(results, safe=False)

stockfish = Stockfish(str(Path(__file__).resolve().parent / "engines/botBinaries/stockfish19"), depth=8)

def getEval(request):
    if request.method == "POST":
        fen = request.POST.get("fen")

        stockfish.set_fen_position(fen)
        eval = stockfish.get_evaluation()

        return HttpResponse(eval["value"])

    return HttpResponse("err")
