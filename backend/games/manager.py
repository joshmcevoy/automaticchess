import asyncio
import random
from time import sleep
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.db import connection
from asgiref.sync import async_to_sync, sync_to_async
from bots.engine import Engine
import traceback
import chess
from time import time
from datetime import datetime
from bots.models import Bot
from games.models import Game, Move

class GameManager:

    def __init__(self, gameId, white, black):
        self.gameId = gameId

        self.white = white
        self.black = black

        self.whiteORM = Bot.objects.get(playerid=white.id)
        self.blackORM = Bot.objects.get(playerid=black.id)

        self.whiteId = white.id
        self.blackId = black.id

        self.board = chess.Board()
        self.channel_layer = get_channel_layer()

        self.isOver = False

        self.white.start()
        self.black.start()

    def create(self):
        Game.objects.create(
            gameid = self.gameId,
            white = self.whiteORM,
            black = self.blackORM,
            isDraw = False
        )

    async def gameLoop(self):
        await sync_to_async(self.create)()

        try:
            while not self.board.is_game_over():
                await self.broadcast(await self.getMove())

            if self.board.is_game_over():
                await self.gameOver()

        except Exception:
            traceback.print_exc()

        finally:
            try:
                await sync_to_async(self.white.stop)()
            finally:
                await sync_to_async(self.black.stop)()

    async def broadcast(self, move=None):
        if self.channel_layer is None:
            raise RuntimeError("No channel layer configured")

        if move != None:
            await self.channel_layer.group_send(
                f"game.{self.gameId}",
                {
                    "type": "game.update",
                    "game_id": self.gameId,
                    "move": move,
                    "ply": len(self.board.move_stack),
                },
            )

    @database_sync_to_async
    def getMove(self):
        engine = self.white if self.board.turn == chess.WHITE else self.black

        # get last played move, default to start if no moves played yet
        lastPlayedMove = "start"
        if self.board.move_stack:
            lastPlayedMove = self.board.peek().uci()

        moveRaw = engine.getMove(lastPlayedMove)
        moveParsed = self.board.parse_uci(moveRaw)
        self.board.push(moveParsed)

        Move.objects.create(
            moveNum = self.board.fullmove_number,
            game = Game.objects.get(gameid=self.gameId),
            move = moveParsed.uci()
        )

        return moveParsed.uci()

    @database_sync_to_async
    def gameOver(self):
        outcome = self.board.outcome()
        winner = None

        if outcome is not None:
            if outcome.winner == chess.WHITE:
                winner = self.whiteORM
            elif outcome.winner == chess.BLACK:
                winner = self.blackORM

        game = Game.objects.get(gameid=self.gameId)

        game.winner = winner
        if winner is None:
            game.isDraw = True

        game.save()

        print(f"Game {game.gameid}: {self.whiteORM.name} vs {self.blackORM.name} over at {datetime.now().strftime('%I:%M:%S %p')}")
        print(f"Result: {self.board.result()}")
        if not game.isDraw:
            print(f"Winner: {game.winner.name} (id {game.winner.playerid})")
        print("\n")

        self.isOver = True

        # update elo
        # A = white, B = black
        Ra = self.whiteORM.elo
        Rb = self.blackORM.elo

        Ea = 1/(1 + pow(10, (Rb-Ra)/400))
        Eb = 1 - Ea

        if game.isDraw:
            Sa = 0.5
            Sb = 0.5
        elif game.winner.playerid == self.whiteORM.playerid:
            Sa = 1
            Sb = 0
        elif game.winner.playerid == self.blackORM.playerid:
            Sa = 0
            Sb = 1

        RaNew = Ra + round(32 * (Sa - Ea))
        RbNew = Rb + round(32 * (Sb - Eb))

        self.whiteORM.elo = RaNew
        self.blackORM.elo = RbNew

        self.whiteORM.save(update_fields=["elo"])
        self.blackORM.save(update_fields=["elo"])

        async_to_sync(self.channel_layer.group_send)(
            f"game.{self.gameId}",
            {
                "type": "game.over",
                "winnerid": winner.playerid if winner else None,
                "isDraw": game.isDraw,
                "ply": len(self.board.move_stack),
                "newElo": game.winner.elo + abs(RaNew) if winner else None
            }
        )
