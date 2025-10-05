import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

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