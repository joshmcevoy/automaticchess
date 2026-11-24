import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './style/GameHistoryView.module.css'
import { loadGame, type Game } from "./loadGame"
import Chessboard from './Chessboard';
import { PROJ_NAME } from './config'

function GameHistoryView() {

    const [gameData, setGameData] = useState<Game[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = () => {
            loadGame()
                .then(games => {
                    setGameData([...games].reverse())
                })
                .catch(console.error);
        };

        fetchGames();

        const interval = setInterval(fetchGames, 10000);

        return () => clearInterval(interval);
    }, []);

    function formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000)

        const day = date.toLocaleDateString('en-AU', { weekday: 'short' })
        const month = date.toLocaleDateString('en-AU', { month: 'short' })

        const hours = date.getHours()
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const period = hours >= 12 ? 'pm' : 'am'
        const hours12 = hours % 12 || 12

        return `${day} ${date.getDate()} ${month} ${hours12}:${minutes}${period}`
    }

    function renderResult(game: Game) {
        if (game.ongoing) {
            return (<>Ongoing</>);
        }

        if (game.isDraw) {
            return (<>Draw</>);
        }

        if (game.winner !== undefined) {
            return (
                <div className={styles.results}>
                    <div>{game.winner.id === game.black.id ? "1" : "0"}</div>
                    <div>{game.winner.id === game.white.id ? "1" : "0"}</div>
                </div>
            )
        }

        return (<>Unknown</>);
    }

    return (
        <>
            <title>{`Games - ${PROJ_NAME}`}</title>
            <div className="games">
                <table>
                    <tr className={styles.tableHeading}>
                        <th>Board</th>
                        <th>Players</th>
                        <th>Results</th>
                        <th>Moves</th>
                        <th>Date</th>
                    </tr>
                    {gameData?.map((game) => (
                        <tr
                            key={game.id}
                            className={game.id % 2 == 0 ? styles.rowD : styles.rowL}
                            onClick={() => navigate(`/game/${game.gameid}`)}
                        >
                            <td>
                                <Chessboard gameId={ String(game.gameid) } setMoveList={undefined} width={ 15 } height={ 15 } />
                            </td>
                            <td>
                                <div className={styles.players}>
                                    <div>{game.white.name}</div>
                                    <div>{game.black.name}</div>
                                </div>
                            </td>
                            <td>
                                {renderResult(game)}
                            </td>
                            <td>{game.moves.length}</td>
                            <td>{ formatTimestamp(game.timestamp) }</td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    )
}

export default GameHistoryView;
