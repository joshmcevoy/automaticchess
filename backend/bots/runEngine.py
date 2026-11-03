import chess
import chess.engine
import sys
from pathlib import Path
import json
import random

class RunEngine:
    def __init__(self, engineName, config):
        self.engine = chess.engine.SimpleEngine.popen_uci(
            str(Path(__file__).resolve().parent / "engines" / "botBinaries" / engineName)
        )

        self.engine.configure(config)

    def choose_move(self, fen):
        board = chess.Board(fen)

        '''
        if random.randint(0, 50) == 0:
            legalMoves = list(board.legal_moves)
            return random.choice(legalMoves)
        '''

        result = self.engine.play(
            board,
            chess.engine.Limit(time=1)
        )

        return result.move.uci()

    def getInput(self):
        for line in sys.stdin:
            fen = line.strip()

            if fen == "quit":
                break

            move = self.choose_move(fen)
            print(move, flush=True)

if __name__ == "__main__":
    filename = sys.argv[1]
    config = json.loads(sys.argv[2])

    runEngine = RunEngine(filename, config)
    runEngine.getInput()
