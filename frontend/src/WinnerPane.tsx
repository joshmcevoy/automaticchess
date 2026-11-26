import styles from './style/WinnerPane.module.css';
import { type Game } from './loadGame.ts';
import { API_URL } from './config.ts';

function WinnerPane({ game, onClose }: { game: Game; onClose: () => void }) {

    function getResultText() {

        if (game.isDraw) {
            return (
                <>
                    <h2>Game drawn</h2>
                </>
            );
        }

        return (
            <div className={styles.resultText}>
                <img src={`${API_URL}${game.winner!.profilepicture}`} style={{ paddingRight: "5px" }} width="30" height="30" />
                <div className={styles.moveCount}><h2>{game.winner?.name}</h2> won in <h2>{game.moves.length}</h2> moves</div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.boardBlur}></div>
            <div className={styles.winnerPane}>
                <div className={styles.winnerPaneContent}>
                    <p className={styles.closeButton} onClick={onClose}>Close</p>
                    <div className={styles.gameOverBanner}>
                        <h1 className={styles.gameOverText}>Game Over</h1>
                    </div>
                    <div className={styles.winDetails}>
                        { getResultText() }
                    </div>
                </div>
            </div>
        </>
    )

}

export default WinnerPane;
