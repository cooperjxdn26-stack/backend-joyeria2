import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../utils/validate.js";
import { saleDto } from "./sales.dto.js";
import { createSale } from "./sales.controller.js";

const r = Router();
r.use(requireAuth);

r.post("/", requireAdmin, validate(saleDto), createSale);

export default r;
