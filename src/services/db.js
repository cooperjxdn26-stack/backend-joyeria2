import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const prisma = new PrismaClient();

export async function seedAdmin() {
  const exists = await prisma.user.findUnique({
    where: { email: env.seedEmail },
  });

  if (!exists) {
    await prisma.user.create({
      data: {
        email: env.seedEmail,
        password: await bcrypt.hash(env.seedPass, 10),
        role: "ADMIN",
      },
    });
    console.log("👑 Admin creado:", env.seedEmail);
  }
}
