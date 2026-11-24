import subprocess
import sys
from pathlib import Path
from threading import Lock, Thread
from django.db import connection
from channels.db import database_sync_to_async
import json
from bots.models import Bot
from django.conf import settings
from shutil import copyfile

class Engine:
    def __init__(self, id, name, path, config, profilepicture):
        self.id = id
        self.name = name
        self.filename = path
        self.path = Path(__file__).resolve().parent / "engines"/  "runEngine.py"
        self.config = config
        self.profilepicture = profilepicture

    def savePfp(self):
        # get .jpg .png etc.
        filetype = self.profilepicture.split(".")
        filetype = filetype[len(filetype) - 1]

        source = settings.BASE_DIR /  self.profilepicture
        destination = settings.MEDIA_ROOT / "bot" / f"{self.id}.{filetype}"

        destination.parent.mkdir(parents=True, exist_ok=True)
        copyfile(source, destination)

        return f"{settings.MEDIA_URL}bot/{self.id}.{filetype}"


    def create(self):
        Bot.objects.create(
            playerid = self.id,
            name = self.name,
            path = self.filename,
            profilepicture = self.savePfp()
        )

    def start(self):
        self.engine = subprocess.Popen(
            [sys.executable, str(self.path), str(self.filename), json.dumps(self.config)],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )

        self.lock = Lock()

        Thread(target=self.readErrors, daemon=True).start()

    def stop(self):
        process = getattr(self, "engine", None)

        if process is None:
            return

        if process.poll() is None:
            try:
                process.stdin.write("quit\n")
                process.stdin.flush()
            except (BrokenPipeError, OSError):
                pass

            try:
                process.wait(timeout=15)
            except subprocess.TimeoutExpired:
                process.terminate()
                try:
                    process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()

        self.engine = None

    def readErrors(self):
        return # silence errors for the time being
        for line in self.engine.stderr:
            print(f"[Engine error] {line.rstrip()}", file=sys.stderr, flush=True)

    def getMove(self, uci):
        with self.lock:
            self.engine.stdin.write(uci + "\n")
            self.engine.stdin.flush()

            response = self.engine.stdout.readline()

            return response.strip()
