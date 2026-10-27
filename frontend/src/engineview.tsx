import { useParams } from "react-router";
import "./style/engineview.css";

function EngineView() {
    const { id } = useParams();

    return (
        <div>
            <div className="engineId">
                <img className="engineImg" src={'/assets/ppdefault.png'} width="100" height="100" />
                <div className="engineDetails">
                    <h2>Stockfish</h2>
                    <p>Open source chess engine</p>
                    <p>In game - Playing since October 2026</p>
                </div>
            </div>
            <hr></hr>
            <div className="statistics">
                <table>
                    <tr>
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
                </div>
            </div>
        </div>
    );
}

export default EngineView;
