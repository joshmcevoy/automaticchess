import { Link, useParams } from "react-router";
import { useState, useEffect } from 'react';
import Chessboard from './Chessboard';
import MovesPanel from './MovesPanel';
import styles from './style/GameView.module.css';
import { loadGame, type Game, type Bot } from "./loadGame";
import { API_URL, PROJ_NAME } from "./config";

function GameView() {

    const { gameId } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [white, setWhite] = useState<Bot | null>(null);
    const [black, setBlack] = useState<Bot | null>(null);

    useEffect(() => {
        console.log(gameId);
        loadGame({ gameid: Number(gameId) })
            .then(data => {
                const game = data[0];
                console.log(`Loaded game id: ${game.gameid}`);
                console.log(game);
                setGame(game);
                setWhite(game.white);
                setBlack(game.black);
            })
            .catch(console.error);
    }, [gameId])

    const [moveList, setMoveList] = useState<string[][]>([]);

    return (
        <>
            <title>{game ? `${game.white.name} vs ${game.black.name} - ${PROJ_NAME}` : PROJ_NAME}</title>
            <div className={`${styles.playerCard} ${styles.playerBlack}`}>
                <img src={`${API_URL}${game?.black.profilepicture}`} style={{ paddingRight: "5px" }} width="30" height="30" />
                <p className={ styles.playerName }>
                    <Link to={`/engine/${black?.playerid}`}>{ black?.name ?? "Loading" }</Link>
                </p>
                <p className="elo" title={`${String(black?.elo ?? 1500)} ELO`}>{ black?.elo ?? 1500 }</p>
            </div>
            <div className="boardmovespanel">
                <Chessboard gameId={ String(game?.gameid) } setMoveList={setMoveList} />
                <MovesPanel moveList={moveList} />
            </div>
            <div className={`${styles.playerCard} ${styles.playerWhite}`}>
                <img src={`${API_URL}${game?.white.profilepicture}`} style={{ paddingRight: "5px" }} width="30" height="30" />
                <p className={ styles.playerName }>
                    <Link to={`/engine/${white?.playerid}`}>{ white?.name ?? "Loading" }</Link>
                </p>
                <p className="elo" title={`${String(white?.elo ?? 1500)} ELO`}>{ white?.elo ?? 1500 }</p>
            </div>
        </>
    )
}

export default GameView;
