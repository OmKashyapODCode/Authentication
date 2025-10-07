import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import {createClient} from "redis";
import cookieParser from 'cookie-parser';

dotenv.config();
await connectDB();

// Initialize Redis connection
const redisURL = process.env.REDIS_URL;

// Check if Redis URL is provided in the environment variables
if (!redisURL) {
    console.log("missing redis url");
    process.exit(1); // Stop the server if no Redis URL is found
}

// Create a Redis client instance using the provided URL
export const redisClient = createClient({
    url: redisURL,
});

// Connect to Redis and handle connection success or errors
redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch(console.error);


const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//import routes 
import userRoutes from './routes/user.js';

//using routes
app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})