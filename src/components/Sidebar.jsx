import React from 'react'
import styles from '../styles/sidebar.module.css'
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {
  //component to render sidebar of the chat in dashboard
  return (
    <div className={styles.sidebar}>
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar