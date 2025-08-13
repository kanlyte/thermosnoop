// components/auth/ResetPasswordForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock } from 'lucide-react'

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

// Schema
import { ResetPasswordSchema } from '@/lib/schemas'

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  })

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: values.password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          toast.success('Password reset successfully!')
          router.push('/auth/login')
        } else {
          toast.error(data.data || 'Failed to reset password')
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <CardWrapper
      headerTitle="Reset Password"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">New Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 py-6 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-gray-400" /> : 
                        <Eye className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                  </div>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10 py-6 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="h-4 w-4 text-gray-400" /> : 
                        <Eye className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
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
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}