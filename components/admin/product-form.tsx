'use client';

import { ProductFormValues } from '@/types';
import { Product } from '@/types';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productDefaultValues } from '@/lib/constants';
import { productFormSchema } from '@/lib/validators';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product && type === 'Update' ? product : productDefaultValues,
  });


  return <>Form</>;
};

export default ProductForm;
