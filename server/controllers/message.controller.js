import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io , userSocketMap } from "../server.js";

// -------- Get all users except the logged in user ------
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.findById({ _id: { $ne: userId } }).select(
      "-password"
    );

    // -- count the number of mesages not seen
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, user: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};



// -------- Get all messages for selected user ------
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};



// -------- Api to mark messages as seen using messages id ------
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};



// -------- Send message to selected user------
export const sendMessage = async (req, res) => {
  try {
    const {text , image} = req.body
    const receiverId = req.param.id
    const senderId = req.user._id

    let imageUrl 
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }

    const newMessage = Message.create({
        senderId , receiverId , text , image : imageUrl
    })

    // Emit the new messages to the reciever's socket
    const recieverSocketId = userSocketMap[receiverId]
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage" , newMessage)
    }
     
    res.json({success : true , newMessage})
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};
