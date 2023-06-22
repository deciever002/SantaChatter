import React, { useContext } from 'react'
import styles from '../styles/statusbar.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Statusbar = () => {
  //get the current user from auth context
  const {currentUser} = useContext(AuthContext);

  //show the user if it is logged in
  return (
    <div className={styles.statusBar}>
      <Link to="/dashboard" style={{color: 'white',textDecoration: 'none'}}>
        <div className={styles.user}>
          <img className={styles.userIcon} src={currentUser.photoURL} alt='userimage' />
          <span>{currentUser.name}</span>
        </div>
      </Link>
      <button onClick={() => signOut(auth)} className={styles.logoutBtn}>
        Logout
      </button>
    </div>
  )
}

export default Statusbar