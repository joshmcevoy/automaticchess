import sys
from stockfish import Stockfish
from pathlib import Path
import chess
import chess.engine
import random

class patricia:
    def __init__(self, depth=8):
        self.depth = depth
        self.engine = chess.engine.SimpleEngine.popen_uci(str(Path(__file__).resolve().parent / "botBinaries/stockfish19"))
        self.engine.configure({
            "Threads": 1,
            "Hash": 32,
            "Skill Level": 20
        })

    def choose_move(self, fen):
        board = chess.Board(fen)

        if random.randint(0, 50) == 0:
            legalMoves = list(board.legal_moves)
            return random.choice(legalMoves)

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
    depth = int(sys.argv[1]) if len(sys.argv) > 1 else 8

    engine = patricia(depth)
    engine.getInput()
