import sys
from stockfish import Stockfish
from pathlib import Path
import chess
import random

class sf:
    def __init__(self, depth=8):
        self.depth = depth
        self.stockfish = Stockfish(str(Path(__file__).resolve().parent / "botBinaries/stockfish19"))
        self.stockfish.set_depth(depth)

    def choose_move(self, fen):
        board = chess.Board(fen)

        if random.randint(0, 50) == 0:
            legalMoves = list(board.legal_moves)
            return random.choice(legalMoves)

        self.stockfish.set_fen_position(fen)
        return self.stockfish.get_best_move()

    def getInput(self):
        for line in sys.stdin:
            fen = line.strip()

            if fen == "quit":
                break

            move = self.choose_move(fen)
            print(move, flush=True)

if __name__ == "__main__":
    depth = int(sys.argv[1]) if len(sys.argv) > 1 else 8

    engine = sf(depth)
    engine.getInput()
