import { prisma } from "../../services/db.js";

export async function createSale(req, res, next) {
  try {
    const { items } = req.data;

    let total = 0;

    // Validar stock y calcular total
    for (const it of items) {
      const prod = await prisma.product.findUnique({
        where: { id: it.productId }
      });

      if (!prod) return res.status(404).json({ error: "Producto no existe" });

      if (prod.stock < it.qty)
        return res.status(400).json({ error: `Stock insuficiente para ${prod.name}` });

      total += it.qty * it.unitPrice;
    }

    const sale = await prisma.sale.create({
      data: { total }
    });

    for (const it of items) {
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: it.productId,
          qty: it.qty,
          unitPrice: it.unitPrice
        },
      });

      // actualizar stock
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.qty } },
      });
    }

    res.status(201).json(sale);

  } catch (e) { next(e); }
}
