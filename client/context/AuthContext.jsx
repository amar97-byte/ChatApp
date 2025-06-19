import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUSer] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated and if so , set the user data and connect the socket
    const checkAuth = async () => {
        try {
         const {data} =    await axios.get("/api/auth/check")
         if(data.success){
            setAuthUSer(data.user)
            connectSocket(data.user)
         }

        } catch (error) {
            toast.error(error.message)
        }
    }

// Connect socket fun to handle socket connection and online users updates
const connectSocket = (userData)=> {
    if (!userData || socket?.connected) return
    const newSocket = io(backendUrl , {
        query : {
            userId : userData._id,
        }
    })
    newSocket.connect()
    setSocket(newSocket)

    newSocket.on("getOnlineUsers" ,(userIds)=> {
        setOnlineUsers(userIds)
    })
}

    useEffect(()=> {
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    } ,[])

  const value = {
    axios,
    authUser,
    onlineUsers ,
    socket
  };

  return <AuthContext.Provider value={value}>{Children}</AuthContext.Provider>;
};
