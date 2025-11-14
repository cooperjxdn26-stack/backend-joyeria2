import { prisma } from "./db.js";

export async function getDashboard() {
  const now = new Date();
  const last30 = new Date(now.setDate(now.getDate() - 30));

  // Stock Total
  const products = await prisma.product.findMany();
  const stockTotal = products.reduce((acc, p) => acc + p.stock, 0);

  // Piezas con trazabilidad
  const withStock = products.filter((p) => p.stock > 0);
  const traced = await prisma.certificate.findMany({
    where: { product: { stock: { gt: 0 } } },
  });

  const traceRate =
    withStock.length > 0
      ? Math.round((traced.length / withStock.length) * 100)
      : 0;

  // Alertas de Reorden
  const alerts = products.filter((p) => p.stock < p.minStock).length;

  // Ventas últimos 30 días
  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: last30 } },
  });

  const sales30 = sales.reduce((acc, s) => acc + s.total, 0);

  // Top 5 productos vendidos
  const saleItems = await prisma.saleItem.findMany({
    where: { sale: { createdAt: { gte: last30 } } },
    include: { product: true },
  });

  const map = {};
  for (const s of saleItems) {
    if (!map[s.productId])
      map[s.productId] = {
        product: s.product.name,
        category: s.product.category,
        units: 0,
        total: 0,
      };
    map[s.productId].units += s.qty;
    map[s.productId].total += s.qty * s.unitPrice;
  }

  const top = Object.values(map)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
    .map((x, i) => ({ rank: i + 1, ...x }));

  return {
    stockTotal,
    traceRate,
    alerts,
    sales30,
    top,
  };
}
