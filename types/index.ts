import { z } from 'zod';
import { insertCartSchema, insertProductSchema, cartItemSchema } from '@/lib/validators';

// Database Product type (what Prisma returns)

// Insert Product type (for creating new products)
export type InsertProduct = z.infer<typeof insertProductSchema & {
  id: string;
  rating: string;
  createdAt: Date;
}>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;