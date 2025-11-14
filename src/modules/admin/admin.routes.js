// src/modules/admin/admin.routes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js'; // Importa los middlewares

const router = express.Router();

// Ruta protegida para administradores
router.get('/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Acceso permitido al dashboard de administrador" });
});

// Otras rutas para administradores pueden ser agregadas aquí

export default router;
