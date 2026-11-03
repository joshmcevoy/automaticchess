import subprocess
import sys
from pathlib import Path
from threading import Lock, Thread
from django.db import connection
from channels.db import database_sync_to_async
import json

class Engine:
    def __init__(self, id, name, path, config):
        self.id = id
        self.name = name
        self.filename = path
        #self.path = Path(__file__).resolve().parent / f"engines/{path}"
        self.path = Path(__file__).resolve().parent / "runEngine.py"
        self.config = config

    def create(self):
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO bots (playerid, name, path) VALUES (%s, %s, %s);", [self.id, self.name, self.filename])

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

    def readErrors(self):
        for line in self.engine.stderr:
            print(f"[Engine error] {line.rstrip()}", file=sys.stderr, flush=True)

    def writeLog(self, input, output):
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO botlogs (name, input, output) VALUES (%s, %s, %s)",
                ["test", input, output.strip()])

    def getMove(self, fen):
        with self.lock:
            self.engine.stdin.write(fen + "\n")
            self.engine.stdin.flush()

            response = self.engine.stdout.readline()

            return response.strip()
