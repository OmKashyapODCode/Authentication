import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbConnected = false;

const initDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

const allowedOrigins = [
  "https://odcodeauthentication.netlify.app",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (
    origin &&
    (allowedOrigins.includes(origin) ||
      origin.endsWith(".netlify.app"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

 
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  await initDB();
  return app(req, res);
}
