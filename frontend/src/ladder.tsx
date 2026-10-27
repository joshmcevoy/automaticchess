import './style/ladder.css'

function Ladder() {
    return (
        <div className="ladder">
            <table>
                <tr>
                    <th>#</th>
                    <th>Engine</th>
                    <th>ELO</th>
                    <th>Won</th>
                    <th>Lost</th>
                    <th>Drawn</th>
                    <th>Last 5</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Stockfish</td>
                    <td>3650</td>
                    <td>8</td>
                    <td>2</td>
                    <td>1</td>
                    <td>
                        <div className="lastFive">
                            <div className="wld draw"></div>
                            <div className="wld loss"></div>
                            <div className="wld loss"></div>
                            <div className="wld win"></div>
                            <div className="wld win"></div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Ladder
