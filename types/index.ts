import { z } from 'zod';
import {
  insertCartSchema,
  insertProductSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
} from '@/lib/validators';

// Database Product type (what Prisma returns)
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string | null;
  description: string;
  stock: number;
  price: string; // Decimal converted to string
  rating: string; // Decimal converted to string
  numReviews: number;
  isFeatured: boolean;
  banner: string | null;
  createdAt: Date;
};

// Insert Product type (for creating new products)
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string, email: string };
};
