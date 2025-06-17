import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



// ---- Sign up new user ----

export const signUp = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    //----- Saving Hashed password into the database ----
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //----- Creating new user in database ----
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ---- Login new user ----

export const loginUser = async(req,res) => {
   try {
     const {email,password} = req.body
 
     const userData = await User.findOne({email})
 
     const isPasswordCorrect = await bcrypt.compare(password,userData.password)
 
     if (!isPasswordCorrect) {
       return res.json({ success: false, message: "Password is incorrect" });
     }
     
     const token = generateToken(userData._id);
 
     res.json({
       success: true,
       userData,
       token,
       message: "Login Successfull",
     });
   } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
   }
} 

