"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Button, Stack } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { RootState } from "@/redux/store"
import { fetchhiddenFeedbacks, enableDisableFeedback } from "@/redux/feature/admin/user/user-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function InactiveFeedbackModal({
    open,
    onClose,
    onSuccess,
}: {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}) {
    const dispatch = useAppDispatch()
    const { hidden_feedbacks, total_hidden_feedbacks } = useAppSelector((state: RootState) => state.adminUserReducer)
    const [offset, setOffset] = useState(0)
    const limit = 10

    useEffect(() => {
        if (open) {
            resetAndFetch()
        }
    }, [open])

    const resetAndFetch = async () => {
        try {
            setOffset(0)
            await dispatch(fetchhiddenFeedbacks({ offset: 0, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const fetchMore = async () => {
        try {
            if (hidden_feedbacks.length >= total_hidden_feedbacks) return

            const newOffset = offset + limit
            setOffset(newOffset)

            await dispatch(fetchhiddenFeedbacks({ offset: newOffset, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleEnable = async (uuid: string) => {
        try {
            await dispatch(enableDisableFeedback({ uuid })).unwrap();
            enqueueSnackbar("Feedback enabled successfully", { variant: "success" })

            if (onSuccess) onSuccess()
            resetAndFetch()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Inactive Feedbacks</DialogTitle>

            <DialogContent dividers id="scrollableDiv">
                <InfiniteScroll
                    dataLength={hidden_feedbacks?.length}
                    next={fetchMore}
                    hasMore={hidden_feedbacks?.length < total_hidden_feedbacks}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    <Stack spacing={2}>
                        {hidden_feedbacks && hidden_feedbacks.map((fb: any) => (
                            <Card key={fb.uuid}>
                                <CardContent>
                                    <Box>
                                        <Typography variant="h6">{fb.title}</Typography>
                                        <Typography color="red">Hidden</Typography>
                                    </Box>

                                    <Typography>{fb.description}</Typography>

                                    <Box>
                                        <Typography>Tags:</Typography>
                                        <Box>
                                            {fb.tags.map((tag: any) => (
                                                <Box
                                                    key={tag.uuid}
                                                    sx={{
                                                        px: 1,
                                                        py: 0.5,
                                                        bgcolor: "#eee",
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography>
                                                        {tag.tag_name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography>
                                            Created: {new Date(fb.created_at).toLocaleString()}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleEnable(fb.uuid)}
                                        >
                                            Enable
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </InfiniteScroll>
            </DialogContent>
        </Dialog>
    )
}