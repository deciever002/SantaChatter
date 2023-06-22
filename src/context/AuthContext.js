import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

//create context of authenticated user to be used along the app
export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    //states of auth context provider
    const [currentUser,setCurrentUser] = useState({});
    const [loading,setLoading] = useState(true);

    //sideeffect to detect the change in authentication
    useEffect(() => {
        //if the user is signed in then set the state of current user
        //and provide this context to other users
        const unSub = onAuthStateChanged(auth,async(user)=>{
            if(user){
                setLoading(true);
                //delay to fetch after user is successfully registered
                setTimeout(async() => {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    console.log(docSnap.data());
                    setCurrentUser(docSnap.data());
                    setLoading(false);
                }, 1000);
            }else{
                setCurrentUser(null);
            }
        })

        //cleanup to unsubcribe to db
        return () => {
            unSub();
        }
    },[]);

    //context provider
    return(
        <AuthContext.Provider value={{currentUser,loading}}>
            {children}
        </AuthContext.Provider>
    )
    
}