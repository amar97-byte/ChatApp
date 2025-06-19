import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";
import { log } from "console";

const app = express();

// ---- Socket.io support the http server---
const server = http.createServer(app);


// ------- Initialize socket.io server ----
export const io = new Server ({
  cors : {origin : "*"}
})

// -------- Store online users
export const userSocketMap = {}  // { userid : socketId}

// ------ Socket.io  connection handler -----
io.on("connection" , (socket)=> {
  const userId = socket.handshake.query.userId
  console.log("User Connected" , userId);

  if(userId) userSocketMap[userId] = socket.id
  
  // Emmit online users to all connected clients
  io.emit("getOnlineUsers" , Object.keys(userSocketMap))

  socket.on("disconnect" ,()=> {
    console.log("User Disconnected" , userId);

    delete userSocketMap[userId]
    io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    
  })
})




// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());


// ------ Route setup ------
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth" , userRouter)
app.use("/api/messages" , messageRouter)


//----- Connect to mongodb----
await connectDB()



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on PORT : " + PORT));


