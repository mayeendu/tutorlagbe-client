import { z } from "zod"

export const registrationRole = z.enum(["student", "tutor"])
export const minimumPasswordLength = 8

export const signInSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
})

export const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1, "Enter your full name."),
  password: z
    .string()
    .min(minimumPasswordLength, "Use at least 8 characters.")
    .max(128),
  role: registrationRole,
})
