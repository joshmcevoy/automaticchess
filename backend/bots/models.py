from django.db import models

class Bot(models.Model):
    id = models.AutoField(primary_key=True)
    playerid = models.IntegerField(unique=True)
    name = models.TextField()
    path = models.TextField(null=True, blank=True)
    profilepicture = models.TextField(null=True)
    elo = models.IntegerField(default=1500, null=False)

    class Meta:
        db_table = "bots"
        managed = False
