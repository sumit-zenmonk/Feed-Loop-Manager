"use client"

import { Dialog, DialogTitle, DialogContent, TextField, Button, Stack, } from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/redux/hooks.ts"
import { FeedbackFormType, feedbackSchema } from "@/schemas/feedback"
import { createUserFeedback } from "@/redux/feature/user/feedback/feedback-action"
import { enqueueSnackbar } from "notistack"

export default function FeedbackSchemaFormModal({
    open,
    onClose,
    onSuccess,
}: {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}) {
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FeedbackFormType>({
        resolver: zodResolver(feedbackSchema),
    })

    const onSubmit = async (data: FeedbackFormType) => {
        try {
            const payload = {
                ...data,
                tags: data.tags ? data.tags.split(",") : [],
            }

            const res = await dispatch(createUserFeedback(payload)).unwrap();
            if (res) {
                reset()
                onSuccess()
                onClose()
            }
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Feedback</DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <TextField
                            label="Title"
                            {...register("title")}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Description"
                            multiline
                            rows={3}
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Tags (comma separated)"
                            {...register("tags")}
                        />

                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    )
}