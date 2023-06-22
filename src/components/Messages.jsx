import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/messages.module.css';
import Message from './Message';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
  //states of messages component
  const [messages,setMessages] = useState([]);
  //used chat context to load the chat based on chat id present in the context
  const {data} = useContext(ChatContext);
  console.log(data.chatId);

  //side effect to load the chats based on chat id present in chat context
  useEffect(()=> {
    if(data.chatId!=='null'){
      //fetch chats (messages) between two users
      const unSub = onSnapshot(doc(db,"chats",data.chatId),(doc) => {
        console.log(doc.data())
        doc.exists && setMessages(doc.data().messages);
      })
  
      //cleanup function to unsubscribe to database
      return () => {
        unSub();
      }
    }
  },[data.chatId]);

  //renders messages on screen
  return (
    <div className={styles.messages}>
      {messages.map(m => (
        <Message message={m} key={m.id}/>
      ))
      }
    </div>
  )
}

export default Messages