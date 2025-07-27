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