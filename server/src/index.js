import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./db.js";
import authRouter from "./routes/auth.js";
import appsRouter from "./routes/apps.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false }, // set secure:true in production (https)
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
}));

await connectDB(process.env.MONGO_URL);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/apps", appsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
