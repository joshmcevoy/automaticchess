import asyncio
from django.core.handlers.base import sync_to_async
from django.core.management.base import BaseCommand
import random
from datetime import datetime
from django.db import connection
import json
from bots.engine import Engine
from bots.models import Bot
from asgiref.sync import sync_to_async

from games.manager import GameManager

class Command(BaseCommand):

    def __init__(self):
        self.gameManagers = []
        self.engines = [] # engines that are available to play in format [{"engine": x, "inGame": T/F, "lastOpponent": x}]

    def add_arguments(self, parser):
        parser.add_argument("--json", type=str, help="Path to a JSON file of engines")

    def handle(self, *args, **options):
        #self.cleanDB()

        if options["json"] is None:
            raise RuntimeError("No JSON file provided")

        # Path to JSON file describing engine details
        enginesPath = options["json"]

        with open(enginesPath, "r", encoding="utf-8") as file:
            try:
                data = json.loads(file.read())
                engines = data["engines"]

                for engine in engines:
                    id = random.randrange(10**7, 10**8)
                    name = engine["name"]
                    filename = engine["filename"]
                    config = engine["config"]
                    profilepicture = engine["profilepicture"]

                    newEngine = Engine(id, name, filename, config, profilepicture)

                    botId = Bot.objects.filter(path=filename).values_list("playerid", flat=True).first()

                    if botId is not None:
                        newEngine.id = botId
                    else:
                        newEngine.create()

                    self.engines.append({"engine": newEngine, "inGame": False})

            except json.JSONDecodeError as e:
                raise RuntimeError(f"Invalid JSON: {e}")

        asyncio.run(self.scheduler())

    games = []

    # take list of bots, remove two random ones to create a matchup,
    # repeat until there isn't enough bots to create a game
    async def scheduler(self):

        matchUp = []
        while True:
            selectEngine = self.engines[random.randrange(0, len(self.engines))]

            if not selectEngine["inGame"]:
                selectEngine["inGame"] = True
                matchUp.append(selectEngine)

            if len(matchUp) == 2:
                game = asyncio.create_task(self.runGame(matchUp[0]["engine"], matchUp[1]["engine"]))
                self.games.append(game)
                matchUp.clear()

            botsFree = False
            for engine in self.engines:
                if not engine["inGame"]:
                    botsFree = True

            if not botsFree:
                 await asyncio.gather(*self.games)

            '''
            white = self.engines.pop(random.randrange(0, len(self.engines)))
            black = self.engines.pop(random.randrange(0, len(self.engines)))

            game = asyncio.create_task(self.runGame(white, black))
            games.append(game)
            '''


    def cleanDB(self):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM bots;")
            cursor.execute("DELETE FROM games;")
            cursor.execute("DELETE FROM moves;")

    async def runGame(self, white, black):
        gameId = random.randrange(10**7, 10**8)
        manager = await sync_to_async(GameManager)(gameId, white, black)

        print(f"Started game: http://localhost:5173/game/{gameId} at {datetime.now().strftime('%I:%M:%S %p')}")
        print(f"\t-> {white.name} vs {black.name}")
        print("\n")

        try:
            await manager.gameLoop()
        finally:
            for engine in self.engines:
                if engine["engine"] == white or engine["engine"] == black:
                    engine["inGame"] = False
