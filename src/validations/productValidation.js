import { z } from "zod";

export const productValidation = z.object({
  title: z.string().min(3),
  desc: z.string(),
  category: z.string(),
  quantity: z.number().min(0),
  price: z.number().min(0),
  rating: z.number().min(0).max(5),
  inStock: z.boolean(),
});
