import asyncio
import random
from time import sleep
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.db import connection
from asgiref.sync import sync_to_async
from bots.engine import Engine
import traceback
import chess
from time import time
from datetime import datetime

class GameManager:

    def __init__(self, gameId, white, black):
        self.gameId = gameId

        self.white = white
        self.black = black

        self.whiteId = white.id
        self.blackId = black.id

        self.board = chess.Board()
        self.channel_layer = get_channel_layer()

        self.white.start()
        self.black.start()

    def create(self):
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO games (gameid, whiteid, blackid, timestamp) VALUES (%s, %s, %s, %s);",
                [self.gameId, self.whiteId, self.blackId, int(time())])

    async def gameLoop(self):
        await sync_to_async(self.create)()

        try:
            while not self.board.is_game_over():
                await self.broadcast(await self.getMove())

            if self.board.is_game_over():
                await self.gameOver()

        except Exception:
            traceback.print_exc()

    async def broadcast(self, move=None):
        if self.channel_layer is None:
            raise RuntimeError("No channel layer configured")

        if move != None:
            await self.channel_layer.group_send(
                f"game.{self.gameId}",
                {
                    "type": "game.update",
                    "game_id": self.gameId,
                    "fen": self.board.fen(),
                    "move": move,
                    "ply": len(self.board.move_stack),
                },
            )

    @database_sync_to_async
    def getMove(self):
        engine = self.white if self.board.turn == chess.WHITE else self.black

        moveRaw = engine.getMove(self.board.fen())
        moveParsed = self.board.parse_uci(moveRaw)
        self.board.push(moveParsed)

        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO moves (moveNum, gameid, move, fen) VALUES (%s, %s, %s, %s);",
                [self.board.fullmove_number, self.gameId, moveParsed.uci(), self.board.fen()])

        sleep(1)
        return moveParsed.uci()

    @database_sync_to_async
    def gameOver(self):
        outcome = self.board.outcome()
        winnerId = 0

        if outcome is not None:
            if outcome.winner == chess.WHITE:
                winnerId = self.whiteId
            elif outcome.winner == chess.BLACK:
                winnerId = self.blackId

        with connection.cursor() as cursor:
            cursor.execute("UPDATE games SET winnerid = %s WHERE gameid = %s;",
                [winnerId, self.gameId])

        print(f"Game {self.gameId} over at {datetime.now().strftime('%I:%M:%S %p')}")
        print("Result: ", self.board.result())
        print("Winner: ", str(winnerId))
        print("\n")
