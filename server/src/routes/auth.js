import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields } from "../utils/validators.js";

const router = Router();

router.post("/signup", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  requireFields({ email, password }, ["email", "password"]);
  const existing = await User.findOne({ email });
  if (existing) { const e = new Error("Email already in use"); e.statusCode = 409; e.expose = true; throw e; }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  req.session.userId = user._id;
  res.status(201).json({ email: user.email });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  requireFields({ email, password }, ["email", "password"]);
  const user = await User.findOne({ email });
  if (!user) { const e = new Error("Invalid credentials"); e.statusCode = 401; e.expose = true; throw e; }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) { const e = new Error("Invalid credentials"); e.statusCode = 401; e.expose = true; throw e; }
  req.session.userId = user._id;
  res.json({ email: user.email });
}));

router.post("/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));
router.get("/me", (req, res) => res.json({ user: req.session.userId ? { id: req.session.userId } : null }));

export default router;