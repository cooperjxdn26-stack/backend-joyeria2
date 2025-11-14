import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import { seedAdmin } from "./services/db.js";
import { PrismaClient } from "@prisma/client";  // Asegúrate de que Prisma Client está importado
import { requireAuth, requireAdmin } from './middleware/auth.js';   // Importar el middleware de autenticación

// Rutas
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import materialRoutes from "./modules/materials/materials.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

// Si tienes una ruta de administrador, asegúrate de importarla aquí
import adminRoutes from "./modules/admin/admin.routes.js";  // Importa la ruta de admin

const app = express();

// Crear la instancia de Prisma Client
const prisma = new PrismaClient();

// Verificar la conexión a la base de datos
async function checkDatabaseConnection() {
  try {
    await prisma.$connect(); // Conectar a la base de datos
    console.log("✅ Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1); // Detener el servidor si no se puede conectar
  }
}

// Función para iniciar el servidor después de la conexión con la base de datos
async function startServer() {
  // Verificamos la conexión a la base de datos
  await checkDatabaseConnection(); // Esperamos a que la conexión sea exitosa

  // Creamos el usuario admin si no existe
  await seedAdmin();  // Este proceso también puede requerir la conexión a la base de datos

  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));

  // Rutas
  app.get("/health", (_, res) => res.json({ status: "ok" }));

  // Aplicar el middleware `requireAuth` a las rutas protegidas
  app.use("/api/v1/products", requireAuth, productRoutes);  // Rutas protegidas que requieren autenticación
  app.use("/api/v1/materials", requireAuth, materialRoutes);  // Rutas protegidas

  app.use("/api/v1/auth", authRoutes);  // Ruta no protegida, por ejemplo, para login o registro
  app.use("/api/v1/inventory", requireAuth, inventoryRoutes);  // Rutas protegidas
  app.use("/api/v1/sales", requireAuth, salesRoutes);  // Rutas protegidas
  app.use("/api/v1/dashboard", requireAuth, dashboardRoutes);  // Rutas protegidas

  // Si necesitas rutas para ADMIN:
  app.use("/api/v1/admin", requireAuth, requireAdmin, adminRoutes);  // Aplica requireAdmin a rutas de admin

  // Manejo de errores
  app.use(errorHandler);

  // Iniciar el servidor
  app.listen(env.PORT, () =>
    console.log(`🚀 API corriendo en http://localhost:${env.PORT}`)
  );
}

startServer();  // Iniciar el servidor
