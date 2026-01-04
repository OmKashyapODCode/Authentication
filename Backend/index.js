import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import { createClient } from "redis";
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();
await connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL, // Netlify URL
    credentials: true
}));

//middlewares
app.use(express.json());
app.use(cookieParser());

// Initialize Redis connection
const redisURL = process.env.REDIS_URL;

if (!redisURL) {
    console.log("missing redis url");
    process.exit(1);
}

export const redisClient = createClient({
    url: redisURL,
});

redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch(console.error);

//import routes 
import userRoutes from './routes/user.js';

//using routes
app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
