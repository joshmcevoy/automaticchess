from django.db import migrations, models

import bots.models


def convert_joindates_to_unix(apps, schema_editor):
    Bot = apps.get_model("bots", "Bot")
    bots = Bot.objects.using(schema_editor.connection.alias)
    for bot in bots.only("pk", "joindate").iterator():
        bots.filter(pk=bot.pk).update(joindate_unix=int(bot.joindate.timestamp()))


class Migration(migrations.Migration):
    dependencies = [
        ("bots", "0004_alter_bot_joindate"),
    ]

    operations = [
        migrations.AddField(
            model_name="bot",
            name="joindate_unix",
            field=models.IntegerField(null=True),
        ),
        migrations.RunPython(convert_joindates_to_unix),
        migrations.RemoveField(model_name="bot", name="joindate"),
        migrations.RenameField(
            model_name="bot", old_name="joindate_unix", new_name="joindate"
        ),
        migrations.AlterField(
            model_name="bot",
            name="joindate",
            field=models.IntegerField(default=bots.models.currentTimestamp),
        ),
    ]
