import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "./style/engineview.css";
import { loadBot, loadGame, type Bot, type Game } from "./loadGame";
import { API_URL } from "./config";

function EngineView() {
    const { id } = useParams();

    const [botData, setBotData] = useState<Bot | null>(null)
    const [recentGames, setRecentGames] = useState<Game[] | null>(null);
    const totalGames = recentGames?.length ?? 0;

    const [wins, setWins] = useState(0);
    const [draws, setDraws] = useState(0);
    const [losses, setLosses] = useState(0);

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        loadBot(Number(id))
            .then(bot => {
                if (!ignore) {
                    setBotData(bot[0]);
                }
            })
            .catch(console.error)

        loadGame({ botid: Number(id) })
            .then(games => {
                if (ignore) return;

                setRecentGames(games.toReversed());

                const winCount = games.filter(
                    game => console.log(game)
                ).length;

                const drawCount = games.filter(
                    game => game.isDraw == true
                ).length;

                const lossCount = games.length - (winCount + drawCount);

                console.log(winCount);
                console.log(drawCount);
                setWins(winCount);
                setDraws(drawCount);
                setLosses(lossCount);
            })
            .catch(console.error)

        return () => {
            ignore = true;
        };
    }, [id]);

    useEffect(() => {
        console.log("Recent games data:");
        console.log(recentGames);
    }, [recentGames]);

    return (
        <div>
            <div className="engineId">
                <img className="engineImg" src={`${API_URL}${botData?.profilepicture}`} width="100" height="100" />
                <div className="engineDetails">
                    <h2>{ botData?.name }</h2>
                    <p>Open source chess engine</p>
                    <p>In game - Playing since October 2026</p>
                </div>
            </div>
            <hr></hr>
            <div className="statistics">
                <table>
                    <tr>
                        <td>
                            <p className="statisticDesc">Ladder ranking</p>
                            <h3>1</h3>
                            <p className="statisticDesc">Peak rank: 1</p>
                        </td>
                        <td>
                            <p className="statisticDesc">Games played</p>
                            <h3>{ recentGames?.length }</h3>
                            <p className="statisticDesc">All rated games</p>
                        </td>
                        <td>
                            <p className="statisticDesc">Ladder rating</p>
                            <h3>3,256</h3>
                            <p className="statisticDesc">Peak rank: 2,890</p>
                        </td>
                        <td>
                            <p className="statisticDesc">Ladder rating</p>
                            <h3>3,256</h3>
                            <p className="statisticDesc">Peak rank: 2,890</p>
                        </td>
                    </tr>
                </table>
            </div>
            <hr></hr>
            <div className="gameDetail">
                <div className="recentGames">
                    <p className="headingText">Recent Games</p>
                    <table className="rgTable">
                        <tr className="rgRow">
                            <th className="rgHeader">Engines</th>
                            <th className="rgHeader">Result</th>
                            <th className="rgHeader">Moves</th>
                            <th className="rgHeader">Played</th>
                        </tr>
                        {recentGames?.map(({ white, black, winner, ongoing, isDraw, timestamp, moves }) => (
                            <tr className="rgRow">
                                <td className="rgTableData">{black.name} v {white.name}</td>
                                <td className="rgTableData">
                                    {winner?.playerid == null ? (
                                        <>
                                            {isDraw == true ? (
                                                <div>DRAW</div>
                                            ): (
                                                <div>Ongoing</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="result">{ winner.playerid === black.playerid ? "1" : "0"}</div>
                                            <div className="result">{winner.playerid === white.playerid ? "1" : "0"}</div>
                                        </>
                                    )}
                                </td>
                                <td className="rgTableData">{ moves.length }</td>
                                <td className="rgTableData">{ new Date(timestamp * 1000).toLocaleDateString() }</td>
                            </tr>
                        ))}
                    </table>
                </div>

                <div className="engineExtraDetail">
                    <p className="headingText">Record</p>
                    <div className="wldRatio">
                        <div className="winSegment" style={{
                            width: `${totalGames > 0 ? (wins / totalGames) * 100 : 0}%`
                        }} />
                        <div className="drawSegment" style={{
                            width: `${totalGames > 0 ? (draws / totalGames) * 100 : 0}%`
                        }} />
                        <div className="lossSegment" style={{
                            width: `${totalGames > 0 ? (losses / totalGames) * 100 : 0}%`
                        }} />
                    </div>
                    <table style={{ paddingTop: "23px" }}>
                        <tr>
                            <td>
                                <h4>{ wins }</h4>
                                <p className="statisticDesc">Wins</p>
                            </td>
                            <td>
                                <h4>{ draws }</h4>
                                <p className="statisticDesc">Draws</p>
                            </td>
                            <td>
                                <h4>{ losses }</h4>
                                <p className="statisticDesc">Losses</p>
                            </td>
                        </tr>
                    </table>
                    <hr></hr>
                    <p className="headingText">About</p>
                    <p className="engineAbout">Free, open-source, and cross-platform chess engine, trusted by grandmasters and leading chess platforms worldwide.</p>
                    <table></table>
                </div>
            </div>
        </div>
    );
}

export default EngineView;
