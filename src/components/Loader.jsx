import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/loader.module.css';
import React from 'react'

const Loader = () => {

  // Custom loader component to show loading state
  return (
    <>
        <FontAwesomeIcon icon={faSpinner} className={styles.loader} />
    </>
  )
}

export default Loader;