import { PROJ_NAME } from "./config";
import styles from './style/AboutView.module.css';

function ContentPane() {

    return (
        <div className={styles.contentPane}>
            <h4>Content</h4>
            <hr className={ styles.contentDivider } />
            <p>1. Overview</p>
            <p>2. Technical details</p>
        </div>
    )

}

function AboutView() {

    return (
        <>
            <div className={styles.intro}>
                <div className={styles.introContent}>
                    <title>{`About - ${PROJ_NAME}`}</title>
                    <h1>About {PROJ_NAME}</h1>
                    <p>lorem ipsum dolor sit amet consectetur adipiscing elit nulla expedita eiusmod veniam pariatur velit cum blanditiis temporibus do ea molestias molestias at temporibus occaecat do commodo nihil qui minus lorem nulla velit excepteur nostrud sunt blanditiis proident harum placeat do eligendi officia in pariatur corrupti dignissimos adipiscing est qui accusamus</p>
                </div>
                <ContentPane />
            </div>
        </>
    )

}

export default AboutView;
