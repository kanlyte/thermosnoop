'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import toast, { Toaster } from 'react-hot-toast'

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
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

// Schema and actions
import { RegisterSchema } from '@/lib/schemas'
import { register } from '@/actions/register'
// import { register } from '@/actions/register'

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      contact: '',
      password: '',
      first_name: '',
      last_name: '',
      district: '',
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          toast.error(data.error)
        }
        if (data?.success) {
          toast.success(data.success)
          form.reset({ email: '', contact: '', password: '', first_name: '', last_name: '', district: '' })
          router.push("/auth/login")
        }
      })
    })
  }

  return (
    <CardWrapper
      headerTitle="Create a new account"
      showSocial
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Toaster />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">first name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        disabled={isPending}
                        type="text"
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
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        disabled={isPending}
                        type="text"
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
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Contact Number</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="Enter your contact number"
                        {...field}
                        disabled={isPending}
                        type="tel"
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">District</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="Enter your district"
                        {...field}
                        disabled={isPending}
                        type="text"
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
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="Create a strong password"
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
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                </FormItem>
              )}
            />
          </div>

          <Button 
            disabled={isPending} 
            className="w-full py-6 h-11 mt-2 text-md rounded-lg bg-gray-900 text-white hover:bg-primary font-bold transition-all duration-200"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
          
          <div className="text-xs text-center  mt-4">
            By creating an account, you agree to our <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </div>
          
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="py-5 border-gray-200 hover:bg-gray-50" type="button">
              Google
            </Button>
            <Button variant="outline" className="py-5 border-gray-200 hover:bg-gray-50" type="button">
              GitHub
            </Button>
            <Button variant="outline" className="py-5 border-gray-200 hover:bg-gray-50" type="button">
              Apple
            </Button>
          </div> */}

        </form>
      </Form>
    </CardWrapper>
  )
}