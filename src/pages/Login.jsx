import { Link } from 'react-router-dom';
import styles from '../styles/register.module.css';
import { santaHat, emailIcon, passwordIcon } from './statics'
import {  signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import { auth } from '../firebase';

export default function Login(){
    //states
    const [loading,setLoading] = useState(false);
    const [err,setError] = useState();

    //sideffect to render error toast messages
    useEffect(() => {
        if(err){
            toast(" ❌ "+ err, {
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
    },[err]);

    //when the user clicks on login then log the user in using firebase authentication
    const handleSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            //firebase method to log the user in
            await signInWithEmailAndPassword(auth, email, password);
            toast(" 😁 User Signed In ", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        } catch (error) {
            //show neccessary error messages
            console.log(error.code);
            if(error.code === "auth/user-not-found"){
                setError("User Does not Exist");
            }else if(error.code === "auth/wrong-password"){
                setError("Invalid Password")
            }else{
                setError("Something Went Wrong");
            }
            setLoading(false);
        }
    }

    //render the login page
    return(
        <>
            <div className={styles.formContainer}>
                <h1 className={styles.pageTitle}>Login</h1>
                <div className={styles.formWrapper}>
                    <img alt='hat' src={santaHat} className={styles.hat}/>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                <img src={emailIcon} className={styles.formIcons} alt='formicon'/> Email
                            </label>
                            <input name='email' id='email' type='email' placeholder='Enter your email'/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                <img src={passwordIcon} className={styles.formIcons} alt='formicon'/> Password
                            </label>
                            <input name='password' id='password' type='password' placeholder='Enter your password'/>
                        </div>
                        <button type='submit' className={loading ? `${styles.loadingBtn} ${styles.btn}` :styles.btn}>{loading ? "Logging in.... " : "Login"}</button>
                    </form>
                    <h3 style={{textAlign:'center'}}>Don't have an account? <Link to="/register">Sign Up</Link></h3>
                </div>
                <ToastContainer />
            </div>
        </>
    )
}