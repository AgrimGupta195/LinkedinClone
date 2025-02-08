import express from "express"
const router = express.Router()
import { protectAuth } from "../middleware/authMiddleware.js";
import { acceptConnectionRequest, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnectionRequest, removeConnection, sendConnectionRequest } from "../controllers/connectionController.js";
router.post("/request/:userId", protectAuth, sendConnectionRequest);
router.put("/accept/:requestId", protectAuth, acceptConnectionRequest);
router.put("/reject/:requestId", protectAuth, rejectConnectionRequest);
router.get("/requests", protectAuth,getConnectionRequests);
router.get("/", protectAuth, getUserConnections);
router.delete("/:userId", protectAuth, removeConnection);
router.get("/status/:userId", protectAuth, getConnectionStatus)
export default router