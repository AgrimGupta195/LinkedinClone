import express from "express"
import { getCurrentUser, login, logout, signup } from "../controllers/authController.js";
import { protectAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get('/me',protectAuth,getCurrentUser)
export default router;