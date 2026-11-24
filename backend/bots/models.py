from django.db import models
from time import time

def currentTimestamp():
    return int(time())

class Bot(models.Model):
    id = models.AutoField(primary_key=True)
    playerid = models.IntegerField(unique=True)
    name = models.TextField()
    path = models.TextField(null=True, blank=True)
    profilepicture = models.TextField(null=True)
    elo = models.IntegerField(default=1500, null=False)
    description = models.TextField(null=True, blank=True)
    joindate = models.IntegerField(default=currentTimestamp)

    class Meta:
        db_table = "bots"
