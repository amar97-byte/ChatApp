import Jwt from "jsonwebtoken"
import User from "../models/user.model.js";

// ----- Middleware to protect routes-----
	

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    const user = new User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message});
  }
};
