import { Router } from "express";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const status = req.query.status;
  const filter = { userId: req.session.userId };
  if (status) filter.status = status;
  if (q) filter.$or = [{ company: new RegExp(q, "i") }, { role: new RegExp(q, "i") }];
  const apps = await Application.find(filter).sort({ createdAt: -1 });
  res.json(apps);
});

router.post("/", async (req, res) => {
  const app = await Application.create({ ...req.body, userId: req.session.userId });
  res.status(201).json(app);
});

router.put("/:id", async (req, res) => {
  const updated = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
