import React, { useContext } from 'react'
import styles from '../styles/dashboard.module.css';
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { ChatContext } from '../context/ChatContext';

const Dashboard = () => {

  //used chat context to fetch the data of chat
  const {data} = useContext(ChatContext);

  //render the dashboard page if chatId is not defined or is null then don't load chat component
  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.chatCard}>
          <Sidebar />
          {
            data.chatId !== 'null' ? <Chat /> : null
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard