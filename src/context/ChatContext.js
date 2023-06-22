import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

//context to provide the data of chats along the app
export const ChatContext = createContext();


export const ChatContextProvider = ({children}) => {
    //fetch the current user
    const {currentUser} = useContext(AuthContext);
    const initialState = {
        chatId : "null",
        user: {}
    }

    //reducer to detect the actions and update the state according to the changed actions
    const chatReducer = (state,action) => {
        switch(action.type){
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ?
                    currentUser.uid + action.payload.uid : 
                    action.payload.uid + currentUser.uid
                }
            default:
                return state
        }
    };

    //used useReducer hook to get the state and dispatch function
    const [state,dispatch] = useReducer(chatReducer,initialState);

    //context provider
    return(
        <ChatContext.Provider value={{data: state,dispatch}}>
            {children}
        </ChatContext.Provider>
    )
    
}