'use client';

import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productDefaultValues } from '@/lib/constants';

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

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : zodResolver(insertProductSchema) as any,
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });



  return <>Form</>;
};

export default ProductForm;
