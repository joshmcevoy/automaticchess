import asyncio
from django.core.handlers.base import sync_to_async
from django.core.management.base import BaseCommand
import random
from datetime import datetime
from django.db import connection
import json
from bots.engine import Engine

from games.manager import GameManager

class Command(BaseCommand):

    def __init__(self):
        self.gameManagers = []
        self.engines = [] # engines that are available to play. engines in a game are removed

    def add_arguments(self, parser):
        #parser.add_argument("--games", type=int, default=1, help="Number of games to generate")
        parser.add_argument("--json", type=str, help="Path to a JSON file of engines")

    def handle(self, *args, **options):
        self.cleanDB()

        # Path to JSON file describing engine details
        enginesPath = options["json"]

        with open(enginesPath, "r", encoding="utf-8") as file:
            try:
                data = json.loads(file.read())
                engines = data["engines"]

                for engine in engines:
                    id = random.randrange(10**7, 10**8)
                    name = engine["name"]
                    path = engine["path"]

                    newEngine = Engine(id, name, path)
                    newEngine.create()
                    self.engines.append(newEngine)

            except json.JSONDecodeError as e:
                print(f"Invalid JSON: {e}")

        asyncio.run(self.scheduler())

    async def scheduler(self):
        games = []
        while len(self.engines) >= 2:
            white = self.engines.pop(random.randrange(0, len(self.engines)))
            black = self.engines.pop(random.randrange(0, len(self.engines)))

            game = asyncio.create_task(self.runGame(white, black))
            games.append(game)

        await asyncio.gather(*games)

        '''
        gameIds = []
        gamesNum = options["games"]

        for _ in range(gamesNum):
            gameId = random.randint(10000000, 99999999)

            manager = gameManager(gameId, 46983419, 10583857)
            self.gameManagers.append(manager)

            gameIds.append(gameId)
            print(f"Started game: http://localhost:5173/game/{gameId} at {datetime.now().strftime('%I:%M:%S %p')}")

        asyncio.run(self.run_games())
        '''

    def cleanDB(self):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM bots;")
            cursor.execute("DELETE FROM games;")
            cursor.execute("DELETE FROM moves;")

    async def runGame(self, white, black):
        gameId = random.randrange(10**7, 10**8)
        manager = GameManager(gameId, white, black)

        print(f"Started game: http://localhost:5173/game/{gameId} at {datetime.now().strftime('%I:%M:%S %p')}")
        print(f"\t-> {white.name} vs {black.name}")
        print("\n")

        try:
            await manager.gameLoop()
        finally:
            print("done")

        #await asyncio.gather(
        #    *(gameManager.gameLoop() for gameManager in self.gameManagers)
        #)
