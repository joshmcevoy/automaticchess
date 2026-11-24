import chess
import chess.engine
import sys
from pathlib import Path
import json
import random

class RunEngine:
    def __init__(self, engineName, config, fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"):
        self.engine = chess.engine.SimpleEngine.popen_uci(
            str(Path(__file__).resolve().parent / "botBinaries" / engineName)
        )

        self.engine.configure(config)
        self.board = chess.Board(fen)

    def move(self):
        result = self.engine.play(
            self.board,
            chess.engine.Limit(time=1)
        )

        if result.move is None:
            raise RuntimeError("Engine did not return a move")

        self.board.push(result.move)
        return result.move.uci()

    def getInput(self):
        for line in sys.stdin:
            uci = line.strip()

            if uci == "quit":
                break

            if uci != "start":
                self.board.push_uci(uci)

            move = self.move()
            print(move, flush=True)

if __name__ == "__main__":
    filename = sys.argv[1]
    config = json.loads(sys.argv[2])

    runEngine = RunEngine(filename, config)

    try:
        runEngine.getInput()
    finally:
        runEngine.engine.quit()
