import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  // Verificar encabezado Authorization
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  //  Extraer y normalizar el token
  let token = authorizationHeader.split(" ")[1];
  token = token.trim().replace(/^<|>$/g, ""); // Por si vienen <token>

  // 👇 Log para ver el token limpio
 /* console.log("Token recibido (limpio):", token);*/

  //  Verificar que el secret exista
  if (!env.JWT_SECRET) {
    console.error("❌ JWT_SECRET no está definido en el archivo .env");
    return res
      .status(500)
      .json({ error: "Configuración del servidor incorrecta" });
  }

  // Verificar el token
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // Guardamos la info del token en la request
    next();
  } catch (err) {
    console.error("❌ Error verificando token:", err.name, err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }

    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export function requireAdmin(req, res, next) {
  // Aseguramos que el usuario sea admin o tenga un rol específico
  if (req.user?.role !== "ADMIN" && req.user?.role !== "MODERATOR") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();  // Llamamos al siguiente middleware si es admin o moderator
}
