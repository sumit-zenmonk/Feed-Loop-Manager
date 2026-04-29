import { z } from "zod"

export const loginSchema = z.object({
    email_or_username: z.string().min(1, "Email or Username is required"),
    password: z.string().min(3, "Password must be at least 3 characters")
})

export type LoginSchemaType = z.infer<typeof loginSchema>