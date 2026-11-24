import { useParams } from "react-router";
import { useEffect, useState } from "react";
import styles from "./style/EngineView.module.css";
import { loadBot, loadGame, type Bot, type Game } from "./loadGame";
import { API_URL, PROJ_NAME } from "./config";

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

    function timestampToMonthYear(timestamp: string) {
        return new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(parseInt(timestamp) * 1000));
    }

    return (
        <>
            <title>{botData ? `${botData.name} - ${PROJ_NAME}` : PROJ_NAME}</title>
            <div>
                <div className={styles.engineId}>
                    <img className={styles.engineImg} src={`${API_URL}${botData?.profilepicture}`} width="100" height="100" />
                    <div className={styles.engineDetails}>
                        <h2>{ botData?.name }</h2>
                        <p>Open source chess engine</p>
                        <p>In game - Playing since { timestampToMonthYear(botData?.joindate ?? "0") }</p>
                    </div>
                </div>
                <hr></hr>
                <div className={styles.statistics}>
                    <table>
                        <tr>
                            <td>
                                <p className={styles.desc}>Ladder ranking</p>
                                <h3>1</h3>
                                <p className={styles.desc}>Peak rank: 1</p>
                            </td>
                            <td>
                                <p className={styles.desc}>Games played</p>
                                <h3>{ recentGames?.length }</h3>
                                <p className={styles.desc}>All rated games</p>
                            </td>
                            <td>
                                <p className={styles.desc}>Ladder rating</p>
                                <h3>3,256</h3>
                                <p className={styles.desc}>Peak rank: 2,890</p>
                            </td>
                            <td>
                                <p className={styles.desc}>Ladder rating</p>
                                <h3>3,256</h3>
                                <p className={styles.desc}>Peak rank: 2,890</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <hr></hr>
                <div className={styles.gameDetail}>
                    <div className={styles.recentGames}>
                        <p className={styles.headingText}>Recent Games</p>
                        <table className={styles.rgTable}>
                            <tr className={styles.rgRow}>
                                <th className={styles.rgHeader}>Engines</th>
                                <th className={styles.rgHeader}>Result</th>
                                <th className={styles.rgHeader}>Moves</th>
                                <th className={styles.rgHeader}>Played</th>
                            </tr>
                            {recentGames?.map(({ white, black, winner, ongoing, isDraw, timestamp, moves }) => (
                                <tr className={styles.rgRow}>
                                    <td className={styles.rgTableData}>{black.name} v {white.name}</td>
                                    <td className={styles.rgTableData}>
                                        {winner?.playerid == null ? (
                                            <>
                                                {isDraw == true && ongoing == false ? (
                                                    <div>DRAW</div>
                                                ): (
                                                    <div>Ongoing</div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.result}>{ winner.playerid === black.playerid ? "1" : "0"}</div>
                                                <div className={styles.result}>{winner.playerid === white.playerid ? "1" : "0"}</div>
                                            </>
                                        )}
                                    </td>
                                    <td className={styles.rgTableData}>{ moves.length }</td>
                                    <td className={styles.rgTableData}>{ new Date(timestamp * 1000).toLocaleDateString() }</td>
                                </tr>
                            ))}
                        </table>
                    </div>

                    <div className={styles.engineExtraDetail}>
                        <p className={styles.headingText}>Record</p>
                        <div className={styles.wldRatio}>
                            <div className={styles.winSegment} style={{
                                width: `${totalGames > 0 ? (wins / totalGames) * 100 : 0}%`
                            }} />
                            <div className={styles.drawSegment} style={{
                                width: `${totalGames > 0 ? (draws / totalGames) * 100 : 0}%`
                            }} />
                            <div className={styles.lossSegment} style={{
                                width: `${totalGames > 0 ? (losses / totalGames) * 100 : 0}%`
                            }} />
                        </div>
                        <table style={{ paddingTop: "23px" }}>
                            <tr>
                                <td>
                                    <h4>{ wins }</h4>
                                    <p className={styles.statisticDesc}>Wins</p>
                                </td>
                                <td>
                                    <h4>{ draws }</h4>
                                    <p className={styles.statisticDesc}>Draws</p>
                                </td>
                                <td>
                                    <h4>{ losses }</h4>
                                    <p className={styles.statisticDesc}>Losses</p>
                                </td>
                            </tr>
                        </table>
                        <hr></hr>
                        <p className={styles.headingText}>About</p>
                        <p className={styles.engineAbout}>{ botData?.description }</p>
                        <table></table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EngineView;
