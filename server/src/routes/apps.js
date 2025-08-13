import { Router } from "express";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertIn, assertUrlOptional, requireFields } from "../utils/validators.js";

const router = Router();
router.use(requireAuth);
const STATUS = ["applied","interview","offer","rejected"]; // single source of truth

router.get("/", asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const status = req.query.status;
  const filter = { userId: req.session.userId };
  if (status) filter.status = status;
  if (q) filter.$or = [ { company: new RegExp(q, "i") }, { role: new RegExp(q, "i") } ];
  const apps = await Application.find(filter).sort({ createdAt: -1 });
  res.json(apps);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { company, role, link, status } = req.body;
  requireFields(req.body, ["company", "role"]);
  if (status) assertIn(status, STATUS, "status");
  assertUrlOptional(link, "link");
  const app = await Application.create({ ...req.body, userId: req.session.userId });
  res.status(201).json(app);
}));

router.put("/:id", asyncHandler(async (req, res) => {
  const { link, status } = req.body;
  if (status) assertIn(status, STATUS, "status");
  assertUrlOptional(link, "link");
  const updated = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    req.body,
    { new: true }
  );
  if (!updated) { const e = new Error("Not found"); e.statusCode = 404; e.expose = true; throw e; }
  res.json(updated);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  if (!deleted) { const e = new Error("Not found"); e.statusCode = 404; e.expose = true; throw e; }
  res.json({ ok: true });
}));

export default router;