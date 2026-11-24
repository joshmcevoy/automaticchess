import { useEffect, useState } from 'react';
import './style/ladder.css'
import { PROJ_NAME } from './config'
import { loadBot, type Bot } from "./loadGame";

function Ladder() {

    const [botData, setBotData] = useState<Bot[] | null>(null);

    useEffect(() => {
        loadBot()
            .then(bots => {
                const botsSortedElo = bots.sort((a, b) => b.elo - a.elo);
                setBotData(botsSortedElo);
                console.log(bots);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <title>{`Ladder - ${PROJ_NAME}`}</title>
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
                    {botData?.map((bot, index) => (
                        <tr
                            key={index}
                        >
                            <td>{index + 1}</td>
                            <td>{bot.name}</td>
                            <td>{bot.elo}</td>
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
                    ))}
                </table>
            </div>
        </>
    )
}

export default Ladder
