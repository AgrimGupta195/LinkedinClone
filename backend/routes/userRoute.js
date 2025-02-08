import express from "express";
import { protectAuth } from "../middleware/authMiddleware.js";
import { getPublicProfile, getSuggestedConnections, updateProfile } from "../controllers/userController.js";
const router = express.Router();



router.get("/suggestions",protectAuth,getSuggestedConnections);
router.get("/:username",protectAuth,getPublicProfile);
router.put("/profile",protectAuth,updateProfile);
export default router;
