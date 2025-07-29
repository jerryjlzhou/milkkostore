import { z } from 'zod';
import { insertProductSchema } from '@/lib/validators';

// Database Product type (what Prisma returns)
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  brand: string | null; 
  stock: number;
  images: string[];
  isFeatured: boolean;
  banner: string | null; 
  price: string; 
  rating: string;
  numReviews: number;
  createdAt: Date;
};

// Insert Product type (for creating new products)
export type InsertProduct = z.infer<typeof insertProductSchema>;
