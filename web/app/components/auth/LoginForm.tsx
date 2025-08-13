'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import * as z from 'zod'

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
import { Suspense } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

// Schema and actions
import { LoginSchema } from '@/lib/schemas'
import { SocialProviders } from './SocialProviders'
import { login } from '@/actions/login'
// import { login } from '@/actions/login'

const MainLoginForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  
  // Handle OAuth error
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' 
    ? 'Email already in use with different provider!' 
    : ''
  
  const hasDisplayedError = useRef(false)
  useEffect(() => {
    if (urlError && !hasDisplayedError.current) {
      toast.error(urlError)
      hasDisplayedError.current = true
    }
  }, [urlError])

  // Form setup
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

const onSubmit = (values: z.infer<typeof LoginSchema>) => {
     startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            form.reset();
            router.push("/dashboard");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
}

return (
  <>
    <CardWrapper
      headerTitle="Welcome Back Mate"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Toaster />
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
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
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <Button
                      variant="link"
                      className="p-0 h-auto  hover:text-green-800"
                      type="button"
                    >
                      <Link href="/auth/forgot-password">Forgot Password?</Link>
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
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
          </div>

          <Button 
            disabled={isPending} 
            className="w-full py-6 h-11 mt-2 text-md rounded-lg text-white bg-gray-900 hover:bg-primary font-bold transition-all duration-200"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center">
              {/* <span className="bg-background px-4 text-sm text-primary-500">or continue with</span> */}
            </div>
          </div> 
            <SocialProviders />
          
         
        </form>
      </Form>
    </CardWrapper>
    </>
  )
}


export const LoginForm = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-32">Loading...</div>}>
      <MainLoginForm />
    </Suspense>
  )
}