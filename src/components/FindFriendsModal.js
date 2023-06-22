import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/modal.module.css';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';


const FindFriendsModal = ({setOpenModal}) => {
  //states of the component
  const {currentUser} = useContext(AuthContext);
  const [error,setError] = useState();
  const [loading,setLoading] = useState(false);
  const [userName,setUserName] = useState("");
  const [user,setUser] = useState(null);

  //sideffect to disable the pointer events on the background when modal is opened
  useEffect(() => {
    if(document.querySelector('#upload-icon')){
        //this html element was clickable when modal was being opened so disabled it
        document.querySelector('#upload-icon').style.pointerEvents = "none";
    }
    return () => {
        if(document.querySelector('#upload-icon')){
            document.querySelector('#upload-icon').style.pointerEvents = "auto";
        }
    }
  },[]);  

  //sideeffect to display toast error messages
  useEffect(() => {
    if(error){
        toast(" ❌ "+ error, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
  },[error]);


  //handle search method handles search operation by querying in the database to 
  //search for users
  const handleSearch = async () => {
    setUser(null);
    setLoading(true);
    try {
        //query to search for users
        const q = query(collection(db,"users"), where("name", "==", userName));
        const querySnapshot = await getDocs(q);
        let addFriend = querySnapshot.docs.filter((doc) => (
            doc.data().uid !== currentUser.uid
        ));
        setLoading(false);
        //set the user if found
        addFriend.forEach((doc) => {
            setUser(doc.data());
        })
    } catch (error) {
        console.log(error)
        setError("Something Went Wrong");
    }

  }

  //when the user click on chat room create a chat between two users
  async function handleChat(){
    //check if this group exists or not
    const combinedId = currentUser.uid > user.uid ?
        currentUser.uid + user.uid : 
        user.uid + currentUser.uid;
    try {
        const response = await getDoc(doc(db,"chats",combinedId));
        //if not then create a new one
        if(!response.exists()){
            await setDoc(doc(db,"chats",combinedId),{messages: []});

            //create user chats for the current user to save chat info b/w two users
            await updateDoc(doc(db,"userChats",currentUser.uid),{
                [combinedId+".userInfo"]:{
                    uid: user.uid,
                    name: user.name,
                    photoURL: user.photoURL
                },
                [combinedId+".date"]: serverTimestamp(),

            })
            //vice versa
            await updateDoc(doc(db,"userChats",user.uid),{
                [combinedId+".userInfo"]:{
                    uid: currentUser.uid,
                    name: currentUser.name,
                    photoURL: currentUser.photoURL
                },
                [combinedId+".date"]: serverTimestamp(),
            });
            setUser(null);
            setUserName("");
            setOpenModal(false);
        }

    } catch (error) {
        console.log(error)
        setError("Something Went Wrong");
    }
  }

  //render the find friends modal component
  return (
    <>
        <div className={styles.modalWrapper} onClick={() => setOpenModal(false)}></div>
        <div className={styles.modalContainer}>
            <div className={styles.findFriendsCard}>
                <div className={styles.findFriendContainer}>
                    <input type='text' placeholder='Find Friend (Enter full name)' value={userName} onChange={(e) => setUserName(e.target.value)} className={styles.findFriendInput}/>
                    <button className={styles.findFriendBtn} onClick={handleSearch}>Find</button>
                </div>
                <div className={styles.friendsFoundContainer}>
                { user ? 
                    <div className={styles.foundFriends}>
                        <img src={user.photoURL} alt='userImage' className={styles.friendImg}/>
                        <p style={{fontWeight: '700',fontSize: '1.2em'}}>{user.name}</p>
                        <button className={styles.chatBtn} onClick={handleChat}>Chat</button>
                    </div>
                    : loading ? <Loader /> :<span style={{padding: '1em',margin: '1em',backgroundColor: '#FFCCCB',borderRadius: '0.5em'}}>No Results Found</span>
                }
                </div>
            <ToastContainer />
            </div>
        </div>
    </>
  )
}

export default FindFriendsModal