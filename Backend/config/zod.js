import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine(
      (value) => /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (value) => /[0-9]/.test(value),
      "Password must contain at least one number"
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      "Password must contain at least one special character"
    ),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine(
      (value) => /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (value) => /[0-9]/.test(value),
      "Password must contain at least one number"
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      "Password must contain at least one special character"
    ),
});
