import express from "express"
import { protectAuth } from "../middleware/authMiddleware.js";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
const router = express.Router();

router.get("/",protectAuth,getUserNotifications);
router.put("/:id/read",protectAuth,markNotificationAsRead);
router.delete("/:id",protectAuth,deleteNotification);
export default router;