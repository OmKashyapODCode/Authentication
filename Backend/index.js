import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import {createClient} from "redis";

dotenv.config();
await connectDB();

const redisURL = process.env.REDIS_URL;
if(!redisURL){
    console.log("missing redis url");
    process.exit(1);
}

export const redisClient= createClient({
    url: redisURL,
})

redisClient
.connect()
.then(()=> console.log("connected to redis"))
.catch(console.error);

const app = express();

//middlewares
app.use(express.json());

//import routes 
import userRoutes from './routes/user.js';

//using routes
app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})