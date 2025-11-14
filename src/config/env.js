import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const env = {
  seedEmail: process.env.SEED_ADMIN_EMAIL,   // Leer el correo del admin
  seedPass: process.env.SEED_ADMIN_PASS,     // Leer la contraseña del admin
  DATABASE_URL: process.env.DATABASE_URL,    // Leer la URL de la base de datos
  JWT_SECRET: process.env.JWT_SECRET,        // Leer la clave secreta del JWT
  PORT: process.env.PORT,                    // Leer el puerto del servidor
};