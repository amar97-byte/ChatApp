import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

// ----- Middleware to protect routes-----

export const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.headers.token;
    // console.log(token);
    

    //  const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET)
    // console.log(decoded);
    

    const user = await   User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
     res.json({ success: false, message: error.message});
  }
};
