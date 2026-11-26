from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import F
from games.models import Move
import json
import chess

class GameConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def getGameSnapshot(self):
        moves = list(
            Move.objects
            .filter(game_id=self.game_id)
            .order_by("id")
            .annotate(gameid=F("game_id"))
            .values("moveNum", "gameid", "move")
        )

        board = chess.Board()

        for row in moves:
            board.push_uci(row["move"])

        return {
            "fen": board.fen(),
            "ply": len(moves),
            "moveData": moves
        }

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.group_name = f"game.{self.game_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        snapshot = await self.getGameSnapshot()
        await self.send(text_data=json.dumps({
            "type": "game.snapshot",
            **snapshot
        }))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def game_update(self, event):
        await self.send_json(event)

    async def game_over(self, event):
        await self.send_json(event)
