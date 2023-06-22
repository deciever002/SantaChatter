import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/chats.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import FindFriendsModal from './FindFriendsModal';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Loader from './Loader';

const Chats = () => {
  //state of chats component
  const [chats,setChats] = useState({});
  const {currentUser,loading} = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  //sideffect to render all the chats of the logged in user
  useEffect(() => {
    const getChats = () => {
      //fetch the chats of user 
      const unsub = onSnapshot(doc(db, "userChats",currentUser.uid), (doc) => {
        if(doc.data()){
          setChats(doc.data());
        }
      });
  
      //cleanup method to unsubscribe from the firebase
      return () => {
        unsub();
      }
    }
    currentUser.uid && getChats();
  },[currentUser.uid]);

  //Add friends modal is a modal to add friends
  const [showAddFriendsModal,setModal] = useState(false);

  //whenever a user is clicked chat should open for that user
  const handleChatClick = (user) => {
    dispatch({type: "CHANGE_USER",payload: user})
  }

  //renders a chats component where chats of users are displayed
  return (
    <>
      {showAddFriendsModal && <FindFriendsModal setOpenModal = {setModal}/>}
      <div className={styles.conversationContainer}>
        <h5 style={{margin: "0",letterSpacing: "0.1em"}}>CONVERSATIONS</h5>
        <FontAwesomeIcon onClick={() => setModal(true)} className={styles.addIcon} icon={faAdd} />
      </div>
      { loading ? <Loader /> :
      <div className={styles.users}>
        {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat) => 
        (
          <div key={chat[0]} className={styles.userContainer} onClick={() => handleChatClick(chat[1].userInfo)}>
              <img src={chat[1].userInfo.photoURL} alt='userAvatar' />
              <div className={styles.userInfo}>
                  <h3>{chat[1].userInfo.name}</h3>
                  <p>{chat[1].lastMessage?.text}</p>
              </div>
      </div>
        ))}
      </div>}
    </>
  )
}

export default Chats