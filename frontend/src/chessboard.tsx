import { useState, useEffect, useRef } from 'react';
import Square from './Square';
import './style/chessboard.css'

function parseFEN(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
): (string | null)[][] {
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

function boardtoFEN(grid, moves) {
    const piecePlacement = grid.map(row => {
        const text = row.map(cell => cell === null ? "null" : cell).join("");
        return text.replace(/(?:null)+/g, match => String(match.length / 4));
    }).join("/");

    const curMove = moves % 2 == 0 ? "b" : "w"
    // update these in the future from placeholder values
    const castlingAbility = "KQkq"
    const enPassant = "-"
    const halfMove = "0"

    const outputString = `${piecePlacement} ${curMove} ${castlingAbility} ${enPassant} ${halfMove} ${moves}`;
    return outputString;
}

type ChessboardProps = {
    gameId: string | undefined;
    setMoveList: React.Dispatch<React.SetStateAction<string[][]>>;
};

function Chessboard({gameId, setMoveList }: ChessboardProps) {
    const [grid, setGrid] = useState(parseFEN());

    // receive each board move
    useEffect(() => {
        if (gameId === undefined) return;

        function addMove(move: string) {
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
        const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

        // new updates are either:
        // snapshot: current board layout & moves upon new load
        // update: new board layout & move
        socket.onmessage = (event) => {
            const update = JSON.parse(event.data);
            let fen = "";

            if (update.type === "snapshot") {
                const updateLength = update["moveData"].length;
                fen = update["moveData"][updateLength - 1]["fen"];
                const moves = update["moveData"];

                for (const move of moves) {
                    addMove(move["move"]);
                }
            }

            if (update.type === "game.update") {
                fen = update["fen"];
                const move = update["move"];

                addMove(move);
            }

            setGrid(parseFEN(fen));
        };

        return () => {
            socket.onmessage = null;
            socket.close();
        };

    }, [gameId, setMoveList])

    return (
        <div className="chessboard">
            {Array.from({ length: 64 }, (_, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;

                return <Square
                        row={row}
                        col={col}
                        key={index}
                        isDark={(row + col) % 2 === 1}
                        grid={grid}
                        />;
            })}
        </div>
    )
}

export default Chessboard;
