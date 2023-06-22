import { Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { auth,db,storage } from '../firebase';
import styles from '../styles/register.module.css';
import { santaHat,nameIcon, emailIcon, passwordIcon,uploadIcon } from './statics'
import { useEffect, useState } from 'react';
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  doc, setDoc } from "firebase/firestore"; 

export default function Register(){
    //states
    const [errorMsg,setErrorMsg] = useState(null);
    const [loading,setLoading] = useState(false);

    //sideffect to render error messages as toast notification
    useEffect(() => {
        if(errorMsg){
            toast(" ❌ "+errorMsg, {
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
    },[errorMsg]);

    //handles user registaration
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            //grab the storage module to upload the image to firebase
            const storageRef = ref(storage, name);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                    setErrorMsg(error.code);
                }, 
                () => {
                    //once the image is uploaded
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            //firebase method to create a user using email and password
                            const response = await createUserWithEmailAndPassword(auth, email, password);
                            toast('😁 User Registered', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                                });
                            //update the user name and profile picture
                            await updateProfile(response.user,{
                                displayName: name,
                                photoURL: downloadURL
                            });
                            //create users table which is replica of firebase authenticated users in firestore database
                            await setDoc(doc(db,'users',response.user.uid),{
                                uid: response.user.uid,
                                name,
                                email,
                                photoURL: downloadURL
                            });
                            //create doc for userchats and set it as empty
                            await setDoc(doc(db,"userChats",response.user.uid),{});
                            setLoading(false);
                        } catch (error) {
                            if(error.code === "auth/email-already-in-use"){
                                setErrorMsg("Email Already Exists");
                            }else{
                                setErrorMsg("Something Went Wrong");
                            }
                            setLoading(false);
                        }

                    }); 
                }
            );
        } catch (error) {
            setErrorMsg("Something Went Wrong");
            setLoading(false);
        }
    }

    //render register page
    return(
        <>
            <div className={styles.formContainer}>
                <h1 className={styles.pageTitle}>Register</h1>
                <div className={styles.formWrapper}>
                    <img alt='hat' src={santaHat} className={styles.hat}/>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">
                                <img src={nameIcon} className={styles.formIcons} alt='formicon'/> Username
                            </label>
                            <input required={true} name='username' id='username' type='text' placeholder='Enter your username (like: santaded02)' pattern='^[A-Za-z0-9_]{4,20}$'/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                <img src={emailIcon} className={styles.formIcons} alt='formicon'/> Email
                            </label>
                            <input required={true} name='email' id='email' type='email' placeholder='Enter your email'/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                <img src={passwordIcon} className={styles.formIcons} alt='formicon'/> Password
                            </label>
                            <input required={true} name='password' id='password' type='password' minLength={6} maxLength={25} placeholder='Enter your password'/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="avatar">
                                <img src={uploadIcon} className={styles.formIcons} alt='formicon'/> Upload Your Avatar
                            </label>
                            <input required={true} name='avatar' id='avatar' type='file' />
                        </div>
                        <button type='submit' className={loading ? `${styles.loadingBtn} ${styles.btn}` :styles.btn} >{loading ? "Registering..." : "Register"}</button>
                    </form>
                    <h3 style={{textAlign:'center'}}>Already have an account? <Link to="/login">Sign in</Link></h3>
                </div>
                <ToastContainer />
            </div>
        </>
    )
}