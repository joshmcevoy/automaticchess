import { Link, useParams } from "react-router";
import { useState, useEffect } from 'react';
import Chessboard from './chessboard';
import MovesPanel from './MovesPanel';
import { loadGame, type Game, type Bot } from "./loadGame";

function Board() {

    const { gameId } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [white, setWhite] = useState<Bot | null>(null);
    const [black, setBlack] = useState<Bot | null>(null);

    useEffect(() => {
        loadGame(gameId)
            .then(data => {
                console.log("loaded game:", data.game);
                setGame(data.game);
                setWhite(data.white ?? null);
                setBlack(data.black ?? null);
            })
    }, [gameId])

    const [moveList, setMoveList] = useState<string[][]>([]);

    return (
        <>
            <div className="playerCard" style={{ borderTop: '3px solid #F0B99C' }}>
                <img src={'/assets/ppdefault.png'} style={{ paddingRight: "5px" }} width="30" height="30" />
                <p className="playerName">
                    <Link to="/engine/31732819">{ black?.name ?? "Loading" }</Link>
                </p>
                <p className="elo" title="500 ELO">500</p>
            </div>
            <div className="boardmovespanel">
                <Chessboard gameId={ game?.gameid } moveList={moveList} setMoveList={setMoveList} />
                <MovesPanel moveList={moveList} />
            </div>
            <div className="playerCard" style={{ borderBottom: '3px solid #F0B99C' }}>
                <img src={'/assets/ppdefault.png'} style={{ paddingRight: "5px" }} width="30" height="30" />
                <p className="playerName">
                    <Link to="/engine/41049284">{ white?.name ?? "Loading" }</Link>
                </p>
                <p className="elo" title="600 ELO">600</p>
            </div>
        </>
    )
}

export default Board;
