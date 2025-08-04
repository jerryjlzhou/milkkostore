'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import PaymentCardIcons from '@/components/shared/payment/payment-card-icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import Image from 'next/image';

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const res = await updateUserPaymentMethod(values);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success('Payment method saved successfully!');
        router.push('/place-order');
      } catch (err) {
        console.error('Payment method error:', err);
        toast.error('Something went wrong. Please try again.');
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
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
      >
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-5 w-5" />
            Continue to Order Review
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Method
          </h1>
          <p className="text-gray-600">
            Choose how you&apos;d like to pay for your order
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <Form {...form}>
              <form
                method="post"
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                        >
                          {PAYMENT_METHODS.map((paymentMethod) => (
                            <label
                              key={paymentMethod}
                              htmlFor={`payment-${paymentMethod}`}
                              className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:border-blue-300 block ${
                                field.value === paymentMethod
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <FormItem className="flex items-start space-x-4 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    id={`payment-${paymentMethod}`}
                                    value={paymentMethod}
                                    className="mt-1"
                                  />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel className="text-lg font-semibold text-gray-900 cursor-pointer">
                                    {paymentMethod === 'Card' ? (
                                      <div className="flex items-center gap-3">
                                        <CreditCard className="h-6 w-6 text-blue-600" />
                                        Credit or Debit Card
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-3">
                                        <Image
                                          src="/images/payment-icons/PayPal.svg"
                                          alt="PayPal"
                                          width={100}
                                          height={100}
                                          className="object-contain"
                                        />
                                      </div>
                                    )}
                                  </FormLabel>

                                  {paymentMethod === 'Card' && (
                                    <div className="mt-3">
                                      <p className="text-sm text-gray-600 mb-2">
                                        Secure payment processed by Stripe
                                      </p>
                                      <PaymentCardIcons />
                                      <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <Lock className="h-3 w-3" />
                                          256-bit SSL encryption
                                        </div>
                                        <a
                                          href="https://docs.stripe.com/terminal/payments/collect-card-payment/supported-card-brands"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                        >
                                          View all supported cards
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                  {paymentMethod === 'PayPal' && (
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-600">
                                        Pay securely with your PayPal account
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </FormItem>
                            </label>
                          ))}
                        </RadioGroup>
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
              Your payment information is secure and encrypted
            </div>
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by industry-standard encryption and security measures
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
