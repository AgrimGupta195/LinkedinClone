import express from "express"
import { protectAuth } from "../middleware/authMiddleware.js";
import { createComment, createPost, deletePost, getPost, getpostFeed, likePost } from "../controllers/postController.js";
const router = express.Router();

router.get("/",protectAuth,getpostFeed);
router.post("/create",protectAuth,createPost);
router.post("/delete/:id",protectAuth,deletePost);
router.get("/:id",protectAuth,getPost);
router.post("/:id/comment",protectAuth,createComment);
router.post("/:id/like",protectAuth,likePost)
export default router;
