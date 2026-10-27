from channels.db import database_sync_to_async
from django.db import connection
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

class GameConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def getGameMoves(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT moveNum, gameid, move, fen FROM moves WHERE gameid = %s", [self.game_id])

            columns = [column[0] for column in cursor.description]

            return [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.group_name = f"game.{self.game_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "snapshot",
            "moveData": await self.getGameMoves()
        }))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def game_update(self, event):
        await self.send_json(event)
