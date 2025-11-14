import { z } from "zod";

export const saleDto = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      qty: z.number().positive(),
      unitPrice: z.number().positive(),
    })
  ),
});
