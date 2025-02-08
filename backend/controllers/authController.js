import bcrypt from "bcryptjs"
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async(req,res)=>{
    
    try {
        const{username,name,email,password} = req.body;
        const existingemail = await User.findOne({email});
        if(existingemail) return res.status(400).json({message:"Email ALready Exist"});
        const existingUsername = await User.findOne({username});
        if(existingUsername) return res.status(400).json({message:"Username ALready Exist"});
        if(password.length<6) return res.status(400).json({message:"Password Must be atleast 6 characters"});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new User({
            name,
            username,
            email,
            password:hashedPassword,
        })
        await user.save();
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        if(token){
            res.cookie("jwt-linkedin",token,{
                httpOnly:true, //prevent xss attack
                maxAge:3*24*60*60*1000,
                sameSite:true,
                secure:process.env.NODE_ENV === "production"
            });
        }
        res.status(201).json({message:"User Created Succesfully"});
        const profileURL = process.env.CLIENT_URL+"/profile/"+user.username;
        try {
            await sendWelcomeEmail(user.email,user.name,profileURL);
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"internal serever error"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const login= async(req,res)=>{
    try {
        const{username,password}=req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const pass = bcrypt.compare(password,user.password);
        if(!pass){
            return res.status(400).json({message:"Wrong Password"});
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        if(token){
            res.cookie("jwt-linkedin",token,{
                httpOnly:true, //prevent xss attack
                maxAge:3*24*60*60*1000,
                sameSite:true,
                secure:process.env.NODE_ENV === "production"
            });
        }
        res.status(201).json({message:"User Login Succesfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const logout = async(req,res)=>{
    res.clearCookie("jwt-linkedin");
    res.json({message:"Logout Successfull"});
}
export const getCurrentUser = async(req,res)=>{
    try {
        res.json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}