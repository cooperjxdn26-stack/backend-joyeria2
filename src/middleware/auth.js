import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  // Verificamos que el encabezado Authorization esté presente
  const authorizationHeader = req.headers.authorization;

  // Si no se encuentra el encabezado Authorization o el token es inválido
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  // Extraemos el token del encabezado Authorization
  const token = authorizationHeader.split(" ")[1];  // El token está después de "Bearer "

  try {
    // Verificamos el token usando JWT_SECRET del archivo .env
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;  // Guardamos el payload del token en el objeto 'req.user'
    next();  // Llamamos al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Acceso denegado" });
  next();  // Llamamos al siguiente middleware si es un admin
}
