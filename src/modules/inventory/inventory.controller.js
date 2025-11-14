import { prisma } from "../../services/db.js";

export async function createMovement(req, res, next) {
  try {
    const { materialId, type, qty, reason } = req.data;

    const mat = await prisma.material.findUnique({
      where: { id: materialId }
    });

    if (!mat) return res.status(404).json({ error: "Material no encontrado" });

    const newStock = type === "IN" ? mat.stock + qty : mat.stock - qty;

    if (newStock < 0) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const movement = await prisma.inventoryMovement.create({
      data: { materialId, type, qty, reason }
    });

    await prisma.material.update({
      where: { id: materialId },
      data: { stock: newStock }
    });

    res.status(201).json({ movement, stock: newStock });
  } catch (e) { next(e); }
}

export async function lowStock(req, res, next) {
  try {
    const items = await prisma.material.findMany({
      where: { stock: { lt: prisma.material.fields.minStock } }
    });

    res.json(items);
  } catch (e) { next(e); }
}
