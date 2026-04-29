import { UserRoleEnum } from "@/enums/user"
import { z } from "zod"

export const signupSchema = z
    .object({
        name: z.string().min(1, "User name is required"),
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z.string().min(3, "Password must be at least 3 characters"),
        confirmPassword: z.string().min(3, "Confirm your password"),
        role: z.enum(UserRoleEnum)
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

export type SignupSchemaType = z.infer<typeof signupSchema>