import { z } from "zod"
import { insertProductSchema } from "@/lib/validators"


export type Product = z.infer<typeof insertProductSchema> & {
  // Inferred fields that are not initialized upon creation
  id: string;
  rating: string;
  createdAt: Date;
}