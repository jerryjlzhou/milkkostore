'use client';

import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import { Loader2, Truck, MapPin, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserAddress } from '@/lib/actions/user.actions';


const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async(values) => {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success('Shipping address saved successfully!');

        // Navigate to next step (payment or order review)
        router.push('/payment-method');
      } catch (error) {
        console.error('Error saving shipping address:', error);
        toast.error('Failed to save shipping address. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    });
  };  const SubmitButton = () => {
    const isDisabled = isPending || isSubmitting;

    return (
      <Button
        type="submit"
        disabled={isDisabled}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
      >
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving Address...
          </>
        ) : (
          <>
            <Truck className="mr-2 h-5 w-5" />
            Save Address & Continue
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Address</h1>
          <p className="text-gray-600">
            Enter your delivery address for order fulfillment
          </p>
        </div>

        {/* Shipping Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <Form {...form}>
              <form
                method="post"
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter recipient's full name"
                          autoComplete="name"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter street address"
                          autoComplete="address-line1"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City and Postal Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city"
                            autoComplete="address-level2"
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter postal code"
                            autoComplete="postal-code"
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter country"
                          autoComplete="country-name"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <SubmitButton />
                </div>
              </form>
            </Form>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              Your address information is secure and encrypted
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            We deliver to most locations worldwide
          </div>
          <p className="text-xs text-gray-500">
            Your delivery address will be used for shipping calculations and order fulfillment
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
