import React, { useContext } from 'react'
import styles from '../styles/chat.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import Messages from './Messages'
import Input from './Input';
import { ChatContext } from '../context/ChatContext'

const Chat = () => {

  //Chat component which shows the chat screen on the right
  //used this context to show user's profile info i.e. name and image
  const {data} = useContext(ChatContext);

  //renders a chat screen where user can chat with other users
  return (
    <>
      <div className={styles.chat}>
        <div className={styles.chatBar}>
          <img src={ data.user.photoURL} alt='' />
          <div className={styles.chatNames}>
            {data.user?.name}
          </div>
          <FontAwesomeIcon icon={faAdd} className={styles.addUser} />
        </div>
        <Messages />
        <Input />
      </div>
    </>
  )
}

export default Chat