import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/search.module.css'
import { AuthContext } from '../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
import { ChatContext } from '../context/ChatContext';


const Search = () => {
  //states of search component
  //auth context to fetch the logged in user
  const {currentUser} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [userName,setUserName] = useState("");
  const [user,setUser] = useState(null);
  const [error,setError] = useState();
  //dispatch function to trigger an action return in chat context reducer
  const { dispatch } = useContext(ChatContext);

  //sideffect to handle error
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

  //hide the no result container if it exists
  useEffect(() => {
    if(document.getElementById('no-result')){
      document.getElementById('no-result').style.display = "none"
    }
  },[])

  //hide the no result container after 1s when username is changed
  useEffect(() => {
    setTimeout(() => {
      if(document.getElementById('no-result')){
        if(!userName){
          document.getElementById('no-result').style.display = "none"
        }
      }
    }, 1000);
  },[userName]);

  //handle chat click opens the chat
  const handleChatClick = (user) => {
    dispatch({type: "CHANGE_USER",payload: user});
    setUser(null)
    setUserName("");
  }

  //searches for the user in database
  const handleSearch = async () => {
    setUser(null);
    setLoading(true);
    try {
        //query to search for the user based on input
        const q = query(collection(db,"users"), where("name", "==", userName));
        const querySnapshot = await getDocs(q);
        let searchFriend = querySnapshot.docs.filter((doc) => (
            doc.data().uid !== currentUser.uid
        ));
        //if the user is found then check chat already exists
        //if it exists then only set the state and show the user
        if(searchFriend.length > 0){
          const combinedId = currentUser.uid > searchFriend[0].data().uid ?
          currentUser.uid + searchFriend[0].data().uid : 
          searchFriend[0].data().uid + currentUser.uid;
          console.log("searchfriend id ",searchFriend[0].data().uid);
          console.log(combinedId);
          
          const response = await getDoc(doc(db,"chats",combinedId));
          console.log(response);
          //if exists then set the user and show the user card
          if(response.exists()){
            searchFriend.forEach((doc) => {
              setUser(doc.data());
            })
          }
        }
        setLoading(false);
    } catch (error) {
        console.log(error)
        setError("Something Went Wrong");
    }

  }

  //render search component to search for available chats
  return (
    <>
        <div className={styles.searchContainer}>
            <ToastContainer />
            <input type='text' placeholder='Search for conversation' onKeyUp={handleSearch} value={userName} onChange={(e) => setUserName(e.target.value)} className={styles.searchBar}/>
            { user ? 
            <div className={styles.users}>
              <div className={styles.userContainer} onClick={() => handleChatClick(user)}>
                <img src={user.photoURL} alt='userAvatar' />
                <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                </div>
              </div> 
            </div>
            : loading ? <Loader /> :<span id='no-result' style={{padding: '1em',margin: '1em',backgroundColor: '#FFCCCB',borderRadius: '0.5em'}}>No Results Found</span> }
        </div>
    </>
  )
}

export default Search