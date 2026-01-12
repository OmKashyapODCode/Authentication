import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Authentication",
    });

    console.log("MongoDb connected");
  } catch (error) {
    console.log("Failed to connect");
  }
};

export default connectDb;
