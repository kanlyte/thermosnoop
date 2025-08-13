// components/auth/ForgotPasswordForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import toast from 'react-hot-toast'

// Components
import { CardWrapper } from '@/components/auth/CardWrapper'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { ForgotPasswordSchema } from '@/lib/schemas'
import { requestOtp } from '@/actions/request-otp'

// Schema

export const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })
const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
  startTransition(async () => {
    const result = await requestOtp(values);
    
    if (result.success) {
      toast.success(result.success);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`);
    } else {
      toast.error(result.error);
    }
  });
};

  return (
    <CardWrapper
      headerTitle="Forgot Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="aggi@kanlyte.com"
                        disabled={isPending}
                        type="email"
                        className="pl-10 py-6 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          <Button 
            disabled={isPending} 
            className="w-full py-6 h-11 mt-2 text-md rounded-lg text-white bg-gray-900 hover:bg-primary font-bold transition-all duration-200"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}