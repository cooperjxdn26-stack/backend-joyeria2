import { Router } from "express";
import { validate } from "../../utils/validate.js";
import { materialCreateDto, materialUpdateDto } from "./materials.dto.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import {
  createMaterial,
  listMaterials,
  updateMaterial,
  deleteMaterial,
} from "./materials.controller.js";

const r = Router();
r.use(requireAuth);

r.get("/", listMaterials);
r.post("/", requireAdmin, validate(materialCreateDto), createMaterial);
r.put("/:id", requireAdmin, validate(materialUpdateDto), updateMaterial);
r.delete("/:id", requireAdmin, deleteMaterial);

export default r;
