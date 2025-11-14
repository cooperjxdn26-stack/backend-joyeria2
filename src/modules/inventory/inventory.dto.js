import { z } from "zod";

export const movementDto = z.object({
  materialId: z.number(),
  type: z.enum(["IN", "OUT"]),
  qty: z.number().positive(),
  reason: z.string().optional(),
});
