import sys
import chess
import random

class randomEngine:
    def __init__(self, depth=8):
        self.depth = depth
        self.board = chess.Board()

    def choose_move(self, fen):
        self.board = chess.Board(fen)

        legalMoves = list(self.board.legal_moves)

        return random.choice(legalMoves)

    def getInput(self):
        for line in sys.stdin:
            fen = line.strip()

            if fen == "quit":
                break

            move = self.choose_move(fen)
            print(move, flush=True)

if __name__ == "__main__":
    depth = int(sys.argv[1]) if len(sys.argv) > 1 else 8

    engine = randomEngine(depth)
    engine.getInput()
