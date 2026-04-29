import { z } from "zod"

export const feedbackSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(5, "Description is required"),
    tags: z.string().optional(),
})

export type FeedbackFormType = z.infer<typeof feedbackSchema>