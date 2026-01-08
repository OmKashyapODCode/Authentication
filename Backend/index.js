import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbInitialized = false;

const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://odcodeauthentication.netlify.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(204).end();
  }

  await initDB();

  return app(req, res);
}
