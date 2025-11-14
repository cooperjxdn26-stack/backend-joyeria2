import { prisma } from "../../services/db.js";

// Obtener todos los productos
export async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (e) {
    next(e);
  }
}

// Crear un producto
export async function createProduct(req, res, next) {
  try {
    const product = await prisma.product.create({
      data: req.data
    });
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
}

// Actualizar un producto
export async function updateProduct(req, res, next) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.data
    });
    res.json(updatedProduct);
  } catch (e) {
    next(e);
  }
}

// Eliminar un producto (agregar esta función)
export async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();  // 204 significa "No Content", producto eliminado correctamente
  } catch (e) {
    next(e);  // En caso de error
  }
}
