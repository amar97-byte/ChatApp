import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get all the users at side bar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // function to get all messages for selected user
  const getMessage = async () => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // function to send messages to selected user
  const sendMessage = async (messageData) => {
    try {
      await axios.post(`/api/message/send/${selectedUser._id} `, messageData);
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // function to subscribe to  messages for selected user
    const subscribeToMessages = async()=>{
        if(!socket)  return

        socket.on("newMessage" ,(newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true
                setMessages((prevMessages)=> [...prevMessages , newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages , [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
                }))
            }
        })
    }


  // function to unSubscribe from  messages 
  const unSubscribeFromMessages = async()=>{
    if(socket) socket.off("newMessage")
  }

  useEffect(()=> {
    subscribeToMessages()
    return()=> unSubscribeFromMessages()
  },[socket , selectedUser])


  const value = {
    messages, users , selectedUser , getUsers , setMessages ,sendMessage , setSelectedUser , unseenMessages , setUnseenMessages 
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
