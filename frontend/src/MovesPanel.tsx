import './style/movesPanel.css'

type MovesPanelProps = {
    moveList: string[][];
};

function MovesPanel({ moveList }: MovesPanelProps) {
    return (
        <div className="movesPanel">
            <div className="movesPanelCurrentGame">
                <h2>Move History</h2>
            </div>
            <div>
                {moveList.map((pair, index) => (
                    <div className="movesPanelInner" key={index}>
                        <div className="movesPanelL">{index + 1}. {pair[0]}</div>
                        <div className="movesPanelR">{pair[1]}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MovesPanel
