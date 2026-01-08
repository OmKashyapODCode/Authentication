import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  if (connected) return;

  await mongoose.connect(process.env.MONGO_URI);
  connected = true;
};

export default connectDB;
