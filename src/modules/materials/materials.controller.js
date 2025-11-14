import { prisma } from "../../services/db.js";

export async function listMaterials(req, res, next) {
  try {
    const data = await prisma.material.findMany({
      include: { supplier: true }
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function createMaterial(req, res, next) {
  try {
    const material = await prisma.material.create({
      data: req.data
    });
    res.status(201).json(material);
  } catch (e) { next(e); }
}

export async function updateMaterial(req, res, next) {
  try {
    const m = await prisma.material.update({
      where: { id: Number(req.params.id) },
      data: req.data,
    });
    res.json(m);
  } catch (e) { next(e); }
}

export async function deleteMaterial(req, res, next) {
  try {
    await prisma.material.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();
  } catch (e) { next(e); }
}
