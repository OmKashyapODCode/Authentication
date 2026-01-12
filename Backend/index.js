import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbConnected = false;

const initDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

export default async function handler(req, res) {
  await initDB();
  return app(req, res);
}
