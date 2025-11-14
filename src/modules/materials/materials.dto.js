import { z } from "zod";

export const materialCreateDto = z.object({
  name: z.string().min(2),
  type: z.enum(["ORO", "PLATA", "GEMA", "INSUMO"]),
  sku: z.string().min(2),
  unit: z.string().min(1),
  stock: z.number().optional(),
  minStock: z.number().optional(),
  supplierId: z.number().optional()
});

export const materialUpdateDto = materialCreateDto.partial();
