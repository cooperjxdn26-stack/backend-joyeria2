import { prisma } from "../../services/db.js";

// Crear movimiento de inventario
export async function createMovement(req, res, next) {
  try {
    // Extraemos los datos del movimiento
    const { materialId, type, qty, reason } = req.data;

    // Verificamos si el material existe
    const mat = await prisma.material.findUnique({
      where: { id: materialId }
    });

    if (!mat) {
      return res.status(404).json({ error: "Material no encontrado" });
    }

    // Calculamos el nuevo stock
    const newStock = type === "IN" ? mat.stock + qty : mat.stock - qty;

    // Verificamos si el stock es suficiente
    if (newStock < 0) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Creamos el movimiento de inventario
    const movement = await prisma.inventoryMovement.create({
      data: { materialId, type, qty, reason }
    });

    // Actualizamos el stock del material
    await prisma.material.update({
      where: { id: materialId },
      data: { stock: newStock }
    });

    // Respondemos con el nuevo movimiento y el stock actualizado
    res.status(201).json({ movement, stock: newStock });
  } catch (e) {
    console.error("Error al crear el movimiento:", e);
    next(e); // Pasamos el error al siguiente middleware para manejarlo
  }
}

// Verificar materiales con bajo stock
export async function lowStock(req, res, next) {
  try {
    // Obtener el límite mínimo de stock (puede venir de un parámetro o variable de configuración)
    const minStock = 5;  // Este es un valor hardcodeado; en el futuro podrías hacerlo configurable

    // Obtenemos los materiales cuyo stock es menor que el mínimo
    const items = await prisma.material.findMany({
      where: {
        stock: { lt: minStock }  // Verificamos si el stock es menor al valor mínimo
      }
    });

    // Respondemos con los materiales de bajo stock
    res.json(items);
  } catch (e) {
    console.error("Error al obtener materiales de bajo stock:", e);
    next(e); // Pasamos el error al siguiente middleware para manejarlo
  }
}

// Futuro: Crear función para obtener todos los movimientos de inventario (si es necesario)
export async function getAllMovements(req, res, next) {
  try {
    // Obtener todos los movimientos de inventario
    const movements = await prisma.inventoryMovement.findMany({
      include: { material: true },  // Puedes incluir información sobre el material asociado
      orderBy: { createdAt: 'desc' } // Ordenar los movimientos por fecha, del más reciente al más antiguo
    });

    // Respondemos con todos los movimientos
    res.json(movements);
  } catch (e) {
    console.error("Error al obtener los movimientos de inventario:", e);
    next(e);
  }
}

