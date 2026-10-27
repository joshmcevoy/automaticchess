import { Routes, Route, Link, useLocation } from "react-router";
import Board from './board';
import Ladder from "./ladder";
import './style/global.css'
import EngineView from "./engineview";
import GamesView from "./gamesview";

function App() {
    const curRoute = useLocation();

    return (
        <div className="maincontent">
            <div className="topbargamecontent">
                <div className="topbar">
                    <div className="topbarL">
                        <p className="logo">
                            <Link to="/">Automatic Chess</Link>
                        </p>
                    </div>
                    <div className="topbarR">
                        <ul className="menu">
                            <li className={ curRoute.pathname == "/ladder" ? "menuItem menuItemSelected" : "menuItem" }>
                                <Link to="/ladder">Ladder</Link>
                            </li>
                            <li className={ curRoute.pathname == "/games" ? "menuItem menuItemSelected" : "menuItem" }>
                                <Link to="/games">Games</Link>
                            </li>
                            <li className={ curRoute.pathname == "/engines" ? "menuItem menuItemSelected" : "menuItem" }>
                                <Link to="/engines">Engines</Link>
                            </li>
                            <li className={ curRoute.pathname == "/about" ? "menuItem menuItemSelected" : "menuItem" }>
                                <Link to="/about">About</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/game/:gameId" element={<Board />} />
                    <Route path="/ladder" element={<Ladder />} />
                    <Route path="/games" element={<GamesView />} />
                    <Route path="/engine/:id" element={<EngineView />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
