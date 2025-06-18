import express from "express"
import { checkAuth, loginUser, signUp, updateprofile } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const userRouter = express.Router()

userRouter.post("/signup" , signUp)
userRouter.post("/login" , loginUser)
userRouter.put("/update-profile" , protectRoute , updateprofile)
userRouter.get("/check" , protectRoute , checkAuth)

export default userRouter
