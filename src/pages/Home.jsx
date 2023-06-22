import styles from '../styles/home.module.css';
import homeAsset from '../assets/homeAsset.gif';


export default function Home(){

    //renders the landing page which corresponds to / route
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.homeHeading}>Welcome to christmas theme based santas chat app</h1>
                <img src={homeAsset} alt='chat' />
                <h1 className={styles.subHeading}>Make friends and chat with them online</h1>
            </div>
        </>
    )
}