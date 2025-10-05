import mongoose  from "mongoose";
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected");
    }
    catch(e){
        console.log(e);
    }
}
export default connectDB;