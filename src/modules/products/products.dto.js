import { z } from "zod";

export const productCreateDto = z.object({
  name: z.string(),
  code: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number().optional(),
  minStock: z.number().optional(),
});

export const productUpdateDto = productCreateDto.partial();
