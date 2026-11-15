import styles from './style/EnginesList.module.css'

function EnginesList() {

    return (
        <div className={styles.engineGrid}>
            <div className={styles.engineInfoPane}>
                <img src={'/assets/ppdefault.png'}></img>
            </div>
        </div>
    )
}

export default EnginesList;
