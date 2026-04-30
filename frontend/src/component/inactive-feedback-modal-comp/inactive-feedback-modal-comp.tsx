"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Button, Stack } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { RootState } from "@/redux/store"
import { fetchhiddenFeedbacks, enableDisableFeedback } from "@/redux/feature/admin/user/user-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import styles from "./inactive-feedback-modal-comp.module.css"

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
                    endMessage="None feedback left"
                >
                    <Stack spacing={2}>
                        {hidden_feedbacks && hidden_feedbacks.map((fb: any) => (
                            <Card key={fb.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}>

                                    <Box className={styles.header}>
                                        <Typography variant="h6">{fb.title}</Typography>
                                        <Typography className={styles.hiddenText}>
                                            Hidden
                                        </Typography>
                                    </Box>

                                    <Typography className={styles.description}>
                                        {fb.description}
                                    </Typography>

                                    <Box className={styles.tagsContainer}>
                                        <Typography>Tags:</Typography>
                                        <Box className={styles.tags}>
                                            {fb.tags.map((tag: any) => (
                                                <Box
                                                    key={tag.uuid}
                                                    className={styles.tag}
                                                >
                                                    <Typography>
                                                        {tag.tag_name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box className={styles.footer}>
                                        <Typography>
                                            Created:{" "}
                                            {new Date(
                                                fb.created_at
                                            ).toLocaleString()}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() =>
                                                handleEnable(fb.uuid)
                                            }
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