import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../utils/validate.js";
import { movementDto } from "./inventory.dto.js";
import { createMovement, lowStock } from "./inventory.controller.js";

const r = Router();
r.use(requireAuth);

r.post("/movements", requireAdmin, validate(movementDto), createMovement);
r.get("/low-stock", lowStock);

export default r;
