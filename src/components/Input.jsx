import React, { useContext, useState } from 'react';
import styles from '../styles/input.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {

  const [emojiPickerOpen,setEmojiPickerOpen] = useState(false);

  const [text,setText] = useState("");
  const [image,setImage] = useState();
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  
  function handleEmojiClick(){
      setEmojiPickerOpen(!emojiPickerOpen);
  }

  async function handleSend(){
    if(image){
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
          case 'paused':
              console.log('Upload is paused');
              break;
          case 'running':
              console.log('Upload is running');
              break;
          default:
              break;
          }
      }, 
      (error) => {
          console.log(error,"error here")
      }, 
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              try {
                await updateDoc(doc(db,"chats",data.chatId),{
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL
                  })
                })
              } catch (error) {
                console.log(error);
              }
          }); 
      }
      );
    }else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })
    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })
    setText("");
    setImage(null);
  }

  function handleEnter(e){
    e.code === "Enter" && handleSend();
  }

  return (
    <div className={styles.inputMessage}>
      <div className={styles.inputContainer}>
        <input type='file' style={{display: 'none'}} id='file' onChange={e => setImage(e.target.files[0])}/>
        <label htmlFor='file' id='upload-icon'>
          <FontAwesomeIcon className={styles.attachIcon} icon={faPaperclip} />
        </label>
        <input className={styles.inputChat} onKeyDown={handleEnter} type='text' placeholder='Type your message here' value={text} onChange={e => setText(e.target.value)}/>
        <button className={styles.emojiPickerBtn} onClick={handleEmojiClick}>😁 ❤️ <FontAwesomeIcon icon={faCaretDown} /></button>
        <div className={styles.emojiPicker}>
          { emojiPickerOpen && <Picker data={emojiData} onEmojiSelect={e => setText(text + e.native)} />}
        </div>
        <button onClick={handleSend} className={styles.sendMessageBtn}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Input