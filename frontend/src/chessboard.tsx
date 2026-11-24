import { useState, useEffect } from 'react';
import styles from "./style/Chessboard.module.css";
import { API_URL_BASE } from "./config";

type Cell = string | null;
type Board = Cell[][];

function Square({ isDark, row, col, board, width, height }: {
    isDark: boolean;
    row: number;
    col: number;
    board: Board;
    width: number;
    height: number;
}) {
    const piece = board[row]?.[col];

    const isUpperCase = (str: string) => str === str.toUpperCase();

    return (
        <div style={{ width: width, height: height }} className={isDark ? styles.squareD : styles.squareL}>
            {piece != null ? (
                <img
                    src={`/pieces/${isUpperCase(piece) ? "w" : "b"}${piece.toLowerCase()}.png`}
                    width={ width } height={ height }
                />
            ): ""}

        </div>
    );
}


function parseFEN(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
): Board {
    const rows = fen.split(" ")[0]!.split("/");

    return rows.map(row => {
        const cells: (string | null)[] = [];

        for (const char of row) {
            if (/^[1-8]$/.test(char)) {
                cells.push(...Array<null>(Number(char)).fill(null));
            } else {
                cells.push(char);
            }
        }

        return cells;
    });

}

type BoardCoord = { x: number, y: number };

// convert square coordinate (e.g. e2) to board coord
// y coordinate begins from the bottom
function SquareToCoord(square: string): BoardCoord {
    const x: number = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const y: number = 8 - Number(square.slice(1));

    return {x: x, y: y};
}

function Move(ucimove: string, board: Board): Board {
    const nextBoard: Board = board.map(row => [...row]);

    const from: BoardCoord = SquareToCoord(ucimove.slice(0, 2));
    const to: BoardCoord = SquareToCoord(ucimove.slice(2, 4));

    const piece: Cell = board[from.y][from.x];
    const promotion: string = ucimove[4];

    // promotion
    if (piece && promotion) {
        nextBoard[to.y][to.x] = piece === "P" ? promotion.toUpperCase() : promotion;
    } else {
        nextBoard[to.y][to.x] = board[from.y][from.x];
    }

    // castling
    if (piece?.toLowerCase() === "k" && Math.abs(to.x - from.x) === 2) {
        const kingside: boolean = to.x > from.x;

        const rookFromX: number = kingside ? 7 : 0;
        const rookToX: number = kingside ? to.x - 1 : to.x + 1;

        nextBoard[from.y][rookToX] = board[from.y][rookFromX];
        nextBoard[from.y][rookFromX] = null;
    }

    // en passant
    if (
        piece?.toLowerCase() === "p" &&
        from.x !== to.x &&
        board[to.y][to.x] === null
    ) {
        nextBoard[from.y][to.x] = null;
    }

    nextBoard[from.y][from.x] = null;

    return nextBoard;
}

function Chessboard({ gameId, setMoveList, width = 90, height = 90 }: {
    gameId: string | undefined;
    setMoveList: React.Dispatch<React.SetStateAction<string[][]>> | undefined;
    width?: number;
    height?: number;
}) {
    const [board, setBoard] = useState<Board>(parseFEN());

    // receive each board move
    useEffect(() => {
        if (gameId === undefined) return;

        function addMove(move: string) {
            if (setMoveList === undefined) return;

            const toCoord = move.slice(2, 4);

            setMoveList(previous => {
                const lastRow = previous[previous.length - 1];

                if (!lastRow || lastRow.length === 2) {
                    return [...previous, [toCoord]];
                }

                return [
                    ...previous.slice(0, -1),
                    [...lastRow, toCoord],
                ];
            });
        }

        console.log(`Loading game ${gameId}`);
        const socket = new WebSocket(`ws://${API_URL_BASE}/ws/game/${gameId}`);

        // new updates are either:
        // snapshot: current board layout & moves upon new load
        // update: new board layout & move
        socket.onmessage = (event) => {
            const update = JSON.parse(event.data);

            console.log(update);

            if (update.type === "game.snapshot") {
                const fen = update["fen"];
                const moves = update["moveData"];

                setBoard(parseFEN(fen));

                for (const move of moves) {
                    addMove(move["move"]);
                }
            }

            if (update.type === "game.update") {
                const move = update["move"];

                setBoard(currentBoard => Move(update["move"], currentBoard));
                addMove(move);
            }
        };

        return () => {
            socket.onmessage = null;
            socket.close();
        };

    }, [gameId, setMoveList])

    return (
        <div style={{ gridTemplateColumns: `repeat(8, ${width}px)` }} className={styles.chessboard}>
            {Array.from({ length: 64 }, (_, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;

                return <Square
                        row={row}
                        col={col}
                        key={index}
                        isDark={(row + col) % 2 === 1}
                        board={board}
                        width={width}
                        height={height}
                        />;
            })}
        </div>
    )
}

export default Chessboard;
