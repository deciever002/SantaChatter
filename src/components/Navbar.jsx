import styles from '../styles/navbar.module.css';
import logo from '../assets/logo.png'
import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatusBar from './Statusbar'
import Loader from './Loader';

export default function Navbar(){
    //states of navbar
    const {currentUser,loading} = useContext(AuthContext);
    console.log(loading);

    //Navbar component to render navbar on the screen
    //when user is logged in then hide the login and register routes
    return(
        <>
            <nav>
                <NavLink to="/" style={{textDecoration: "none",color: 'black'}}>
                    <div className={styles.brandContainer}>
                        <img src={logo} alt='Logo' className={styles.brandLogo}/>
                        <h1 className={styles.brandName}>Santa's Chat App</h1>
                    </div>
                </NavLink>
                {
                    currentUser!== null ?
                        loading ? <Loader /> :<StatusBar />
                    : 
                    <div className={styles.links}>
                        <NavLink to="/login" style={({isActive,isPending}) => { 
                            return{
                                transform: isActive ? "scale(1.2)" : ""
                            }
                        }}>Login</NavLink>
                        <NavLink to="/register" style={({isActive,isPending}) => { 
                            return{
                                transform: isActive ? "scale(1.2)" : ""                        }
                        }}>Register</NavLink>
                    </div>
                }
            </nav>
            <Outlet />
        </>
    )
}