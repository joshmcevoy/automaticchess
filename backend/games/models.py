from django.db import models
from time import time
from bots.models import Bot

def currentTimestamp():
    return int(time())

class Game(models.Model):
    id = models.AutoField(primary_key=True)
    gameid = models.IntegerField(unique=True)

    white = models.ForeignKey(
        Bot,
        to_field="playerid",
        db_column="whiteid",
        on_delete=models.DO_NOTHING,
        related_name="gamesAsWhite"
    )

    black = models.ForeignKey(
        Bot,
        to_field="playerid",
        db_column="blackid",
        on_delete=models.DO_NOTHING,
        related_name="gamesAsBlack"
    )

    winner = models.ForeignKey(
        Bot,
        to_field="playerid",
        db_column="winnerid",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True
    )

    isDraw = models.BooleanField()
    timestamp = models.IntegerField(default=currentTimestamp)

    class Meta:
        db_table = "games"

class Move(models.Model):
    id = models.AutoField(primary_key=True)

    game = models.ForeignKey(
        Game,
        to_field="gameid",
        db_column="gameid",
        on_delete=models.DO_NOTHING,
        related_name="moves"
    )

    moveNum = models.IntegerField(db_column="moveNum")
    move = models.TextField()
    fen = models.TextField()

    class Meta:
        db_table = "moves"
