import styles from './style/EnginesList.module.css'
import { PROJ_NAME } from './config';

function EnginesList() {

    return (
        <>
            <title>{`Engines - ${PROJ_NAME}`}</title>
            <div className={styles.engineGrid}>
                <div className={styles.engineInfoPane}>
                    <img src={'/assets/ppdefault.png'}></img>
                </div>
            </div>
        </>
    )
}

export default EnginesList;
