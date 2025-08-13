// components/auth/VerifyOtpForm.tsx
'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
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

// Schema and Actions
import { VerifyOtpSchema } from '@/lib/schemas'
import { verifyOtp } from '@/actions/verify-otp'
import { requestOtp } from '@/actions/request-otp'

type VerifyOtpFormProps = {
  user_id?: string;
};

export const VerifyOtpForm = ({ user_id }: VerifyOtpFormProps) => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isPending, startTransition] = useTransition()
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const form = useForm<z.infer<typeof VerifyOtpSchema>>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      otp: '',
    }
  })

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return
    }

    // Update form value
    const currentOtp = form.getValues('otp').split('')
    currentOtp[index] = value
    const newOtp = currentOtp.join('')
    form.setValue('otp', newOtp, { shouldValidate: true })

    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text/plain').replace(/\D/g, '')
    if (pasteData.length === 6) {
      form.setValue('otp', pasteData, { shouldValidate: true })
      // Focus the last input after paste
      setTimeout(() => inputRefs.current[5]?.focus(), 0)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email is required to resend OTP')
      return
    }

    setIsResending(true)
    try {
      const result = await requestOtp({ email })
      if (result.success) {
        toast.success('New OTP sent successfully!')
        form.reset()
        inputRefs.current[0]?.focus()
      } else {
        toast.error(result.error || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof VerifyOtpSchema>) => {
    if (!user_id) {
      toast.error('User ID is required')
      return
    }

    // Ensure OTP is exactly 6 digits
    if (values.otp.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP')
      return
    }

    console.log('Submitting OTP:', {
      user_id,
      otp: values.otp,
      email
    })

    try {
      startTransition(async () => {
        const result = await verifyOtp(user_id, { otp: values.otp })
        
        if (result.success) {
          toast.success(result.success)
          router.push(`/auth/reset-password?email=${encodeURIComponent(email || '')}&verified=true`)
        } else {
          toast.error(result.error)
          // Clear all inputs on error
          form.setValue('otp', '', { shouldValidate: true })
          inputRefs.current[0]?.focus()
        }
      })
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.')
    }
  }

  return (
    <CardWrapper
      headerTitle="Verify OTP"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <p className="text-sm text-gray-600 mb-6">
        We've sent a 6-digit OTP to your email. Please check your inbox and enter it below.
      </p>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <input type="hidden" name="email" value={email || ''} />
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">OTP Code</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-2">
                      {[...Array(6)].map((_, index) => (
                        <Input
                          key={index}
                          ref={(el: HTMLInputElement | null) => {
                            inputRefs.current[index] = el
                          }}
                          value={form.getValues('otp')[index] || ''}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          maxLength={1}
                          disabled={isPending}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit"
            disabled={isPending || form.getValues('otp').length !== 6}
            className="w-full py-6 h-11 mt-2 text-md rounded-lg text-white bg-gray-900 hover:bg-primary font-bold transition-all duration-200"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isResending ? (
            <>
              <span className="inline-block mr-2">
                <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </span>
              Resending...
            </>
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>
    </CardWrapper>
  )
}