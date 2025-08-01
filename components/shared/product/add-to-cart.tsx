'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart } from '@/types';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Handle success add to cart
      toast.success(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
        actionButtonStyle: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
        },
        className:
          'group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Handle success remove from cart
      toast.success(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
        actionButtonStyle: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
        },
        className:
          'group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      });

      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty} </span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    > 
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4"/> 
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
