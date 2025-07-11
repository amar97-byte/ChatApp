import cloudinary from "../lib/cloudinary.js";
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

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
};

// -------- Controller to check is user authanticated-----

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//-------- Controller to update user  profile -----

export const updateprofile = async (req, res) => {
  try {
    const { bio, profilePic, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,{ profilePic: upload.secure_url, bio, fullName },{ new: true }
      );
    }
    res.json({success : true , user : updatedUser})
  } catch (error) {
    console.log(error.message);
    res.json({success : false , message : error.message})
  }
};
