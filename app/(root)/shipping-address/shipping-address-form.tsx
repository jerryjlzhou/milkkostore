'use client';

import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { shippingAddressDefaultValues } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit = async (data: z.infer<typeof shippingAddressSchema>) => {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        // TODO: Implement save shipping address action
        console.log('Shipping address data:', data);

        toast.success('Shipping address saved successfully!');

        // Navigate to next step (payment or order review)
        router.push('/payment');
      } catch (error) {
        console.error('Error saving shipping address:', error);
        toast.error('Failed to save shipping address. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const SubmitButton = () => {
    const isDisabled = isPending || isSubmitting;

    return (
      <Button
        type="submit"
        disabled={isDisabled}
        className="w-full h-11 text-base font-medium"
      >
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Address...
          </>
        ) : (
          'Save Address & Continue'
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your shipping address for delivery
        </p>

        <Form {...form}>
          <form
            method="post"
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter recipient's full name"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street Address */}
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter street address"
                      autoComplete="address-line1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City and Postal Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city"
                        autoComplete="address-level2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter postal code"
                        autoComplete="postal-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country"
                      autoComplete="country-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
