import z from "zod";

const noSpaces = (value: string) => {
  if (value.includes(' ')) {
    return false
  } else {
    return true
  }
}



export const RegisterSchema = z.object({
  email: z.string().email(),
  contact: z.string().min(10, {
    message: 'Contact number is required'
  }),
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    }),
  first_name: z.string().min(1, {
    message: 'First name is required'
  }),
  last_name: z.string().min(1, {
    message: 'Last name is required'
  }),
  district: z.string().min(1, {
    message: 'District is required'
  }),
})


export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, {
      message: 'Password is required'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    })
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export const VerifyOtpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
  email: z.string().email(),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const RequestOtpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

