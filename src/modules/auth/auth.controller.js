import { prisma } from "../../services/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

// Función de registro (crea un usuario y genera un token)
export async function register(req, res, next) {
  try {
    const { email, password, role } = req.data;  // Cambié de req.data a req.body

    // Verificamos si el correo ya está registrado
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email ya usado" });

    // Encriptamos la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Creamos el usuario
    const user = await prisma.user.create({
      data: { email, password: hash, role },
    });

    // Generamos el token JWT para el usuario recién registrado
    const token = jwt.sign(
       { userId: user.id, role: user.role },  // Datos que quieres incluir en el payload
       process.env.JWT_SECRET,                // La clave secreta para firmar el token
       { expiresIn: '1h' }                    // Tiempo de expiración del token
      );

    // Devolvemos el token y el usuario
    res.status(201).json({ token, user });
  } catch (e) {
    next(e);  // Pasamos el error al siguiente middleware
  }
}

// Función de login (verifica las credenciales y genera el token)
export async function login(req, res, next) {
  try {
    const { email, password } = req.data;  // Cambié de req.data a req.body

    // Buscamos al usuario por el correo electrónico
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

    // Comparamos la contraseña encriptada con la ingresada
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });

    // Generamos el token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },  // Datos a incluir en el token
      env.JWT_SECRET,                    // Usamos el JWT_SECRET de .env
      { expiresIn: "8h" }                // El token tiene un tiempo de expiración de 8 horas
    );

    // Devolvemos el token y el usuario
    res.json({ token, user });
  } catch (e) {
    next(e);  // Pasamos el error al siguiente middleware
  }
}
