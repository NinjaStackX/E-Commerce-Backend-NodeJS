import { z } from "zod";

export const productValidation = z.object({
  title: z.coerce.string().min(3),
  desc: z.coerce.string(),
  category: z.coerce.string(),
  quantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  rating: z.coerce.number().min(0).max(5),
  inStock: z.coerce.boolean(),
});
