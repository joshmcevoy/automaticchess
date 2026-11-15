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
            <div className="movesPlayed">
                {moveList.map((pair, index) => (
                    <div className="movesPanelInner" key={index} style={{ backgroundColor: index % 2 === 0 ? 'var(--colour-background-content)' : 'var(--colour-background-content-secondary)' }}>
                        <div className="movesPanelRow">
                            <div className="movesPanelL">{`${index + 1}. ${pair[0]}`}</div>
                            <div className="movesPanelR">{pair[1]}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MovesPanel
