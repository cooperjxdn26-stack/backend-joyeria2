import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";  // Middleware para autenticación
import { validate } from "../../utils/validate.js";
import { productCreateDto, productUpdateDto } from "./products.dto.js";
import {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from "./products.controller.js";

const r = Router();

// Rutas protegidas: el token JWT es necesario para acceder a estas rutas
r.use(requireAuth);

r.get("/", listProducts);  // Ver productos
r.post("/", requireAdmin, validate(productCreateDto), createProduct);  // Crear productos (solo admins)
r.put("/:id", requireAdmin, validate(productUpdateDto), updateProduct);  // Actualizar productos (solo admins)
r.delete("/:id", requireAdmin, deleteProduct);  // Eliminar productos (solo admins)

export default r;
