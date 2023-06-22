import React, { useContext, useEffect, useRef } from 'react';
import styles from '../styles/message.module.css';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {
  //states of message component
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  //created reference for scrolling smoothly
  const ref = useRef();

  //side effect to handle smooth scrolling of chats
  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'})
  },[message]);

  //Child of Messages component renders message component with message passed as props
  return (
    <>
      <div ref={ref} className={message.senderId === currentUser.uid ? styles.senderMessage : styles.recievedMessage}>
        <div className={styles.messageWrapper}>
          {message.text && <p className={message.senderId === currentUser.uid ? styles.senderMessageCard : styles.recievedMessageCard}>
            {message.text}
          </p>}
          {message.img && <img height="200px" width="200px" style={{border: '1px solid black',borderRadius: '0.5em'}} src={message.img} alt=''/>}
          <div className={message.senderId === currentUser.uid ? styles.sendBy : styles.recievedBy}>
            <p className={styles.sendByName}><b>{message.senderId === currentUser.uid ? "You" : "Your best friend"}</b></p>
            <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} className={styles.userImage} alt='UserPicture'/>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default Message