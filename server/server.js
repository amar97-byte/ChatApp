import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();

// ---- Socket.io support the http server---
const server = http.createServer(app);


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


