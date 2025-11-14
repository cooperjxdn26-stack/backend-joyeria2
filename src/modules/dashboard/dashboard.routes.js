import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getDashboard } from "../../services/dashboard.js";

const r = Router();
r.use(requireAuth);

r.get("/overview", async (req, res, next) => {
  try {
    const data = await getDashboard();
    res.json(data);
  } catch (e) { next(e); }
});

export default r;
