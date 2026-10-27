import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './style/gamesview.css'
import { loadGame, type GameData } from "./loadGame"

function GamesView() {

    const [gameData, setGameData] = useState<GameData[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = () => {
            loadGame("", true)
                .then(data => setGameData([...data].reverse()))
                .catch(console.error);
        };

        fetchGames();

        const interval = setInterval(fetchGames, 10000);

        console.log(gameData);

        return () => clearInterval(interval);
    }, [gameData]);

    return (
        <div className="games">
            <table>
                <tr className="heading">
                    <th className="playerHeader">Players</th>
                    <th>Result</th>
                    <th>Moves</th>
                    <th>Date</th>
                </tr>
                {gameData?.map(({ game, white, black, winner, moves }) => (
                    <tr
                        key={game.gameid}
                        className="gameRow"
                        onClick={() => navigate(`/game/${game.gameid}`)}
                    >
                        <td className="players">
                            <div className="player"><p className="playerName">{ black.name }</p></div>
                            <div className="player">{ white.name }</div>
                        </td>
                        <td className="results">
                            {winner?.id == null ? (
                                <>
                                    {game.isDraw == true ? (
                                        <div>DRAW</div>
                                    ): (
                                        <div>Ongoing</div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="result">{ winner.id === black.id ? "1" : "0"}</div>
                                    <div className="result">{winner.id === white.id ? "1" : "0"}</div>
                                </>
                            )}
                        </td>
                        <td>{ moves.length }</td>
                        <td>{ new Date(game.timestamp * 1000).toLocaleDateString() }</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default GamesView;
