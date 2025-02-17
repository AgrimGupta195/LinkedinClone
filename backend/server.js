import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/posts",postRoutes);
app.use("/api/v1/notifications",notificationRoutes);
app.use("/api/v1/connections",connectionRoutes);

app.listen(PORT,()=>{
    console.log("server is running on port ",PORT);
    connectDB();
})