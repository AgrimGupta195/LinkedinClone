import { sendCommentNotificationEmail } from "../emails/emailHandler.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
export const getpostFeed = async(req,res)=>{
    try {
        const posts = await Post.find({author:{$in:req.connections}}).populate("author","username name profilePic headline").populate("comments.user","name ProfilePic").sort({createdAt:-1});
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const createPost = async(req,res)=>{
    try {
        const {image,content}=req.body;
    let newPost;
    if(image){
        const result =await cloudinary.uploader.upload(image);
        newPost = new Post({
            author:req.user._id,
            content,
            image:result.secure_url,
        })
    }else{
        newPost = new Post({
            author:req.user._id,
            content,
        });
    }
    await newPost.save();
    res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const deletePost = async(req,res)=>{
    try {
        const delPost = await Post.findById(req.params.id);
        if(!delPost){
            return res.status(404).res.json({message:"Post not found"});
        }
        if(delPost.author.toString() !== req.user._id.toString()){
            return res.status(403).res.json({message:"You are not authorized to delete this post"});
        }
        if(delPost.image){
            await cloudinary.uploader.destroy(delPost.image.split("/").pop().split(".")[0]);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(201).res.json({message:"Post Delete Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
} 
export const getPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author","name username profilePic headline").populate("comment.user","name profilePic headline username");
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const createComment = async(req,res)=>{
    try {
        const postId = req.params.id;
        const{content}=req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{comments:{user:req.user._id,content}}
        },{new:true}).populate("author","name email username profilePic headline").populate("comment.user","name profilePic headline username");
        if(post.author.toString()!== req.user._id.toString()){
            const newNotification =new Notification({
                recipient:post.author.id,
                type:"comment",
                relatedUser:req.user._id,
                relatedPost:postId,
            })
            await newNotification.save();
        }
        res.status(200).json(post);
        try {
            const profileURL = process.env_CLIENT_URL+"/post/"+postId;
            await sendCommentNotificationEmail(post.author.email,post.author.name,req.user.name,postUrl,content)
        } catch (error) {
            console.log(error);
        res.status(500).json({message:"internal serever error"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const likePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;
        if(post.likes.includes(userId)){// unliking the post
            post.likes=post.likes.filter(id=> id.toString() !== userId.toString());
        }else{
            if(post.author.toString() !== userId.toString()){
                const newNotification = new Notification({
                    recipient:post.author,
                    type:"like",
                    relatedUser:userId,
                    relatedPost:postId,
                });
                await newNotification.save();
            }
        }
        await post.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}