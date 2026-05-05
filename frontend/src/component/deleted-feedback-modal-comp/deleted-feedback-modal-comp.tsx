"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { RootState } from "@/redux/store"
import { fetchDeletedFeedbacks } from "@/redux/feature/admin/user/user-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import { Feedback } from "@/redux/feature/admin/user/user-type"
import styles from "./deleted-feedback-modal-comp.module.css"

export default function DeletedFeedbackModal({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const dispatch = useAppDispatch()
    const { deleted_feedbacks, total_deleted_feedbacks } = useAppSelector((state: RootState) => state.adminUserReducer)
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
            await dispatch(fetchDeletedFeedbacks({ offset: 0, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const fetchMore = async () => {
        try {
            if (deleted_feedbacks.length >= total_deleted_feedbacks) return

            const newOffset = offset + limit
            setOffset(newOffset)

            await dispatch(fetchDeletedFeedbacks({ offset: newOffset, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Deleted Feedbacks</DialogTitle>

            <DialogContent dividers id="deletedFeedbackScrollableDiv">
                <InfiniteScroll
                    dataLength={deleted_feedbacks?.length}
                    next={fetchMore}
                    hasMore={deleted_feedbacks?.length < total_deleted_feedbacks}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="deletedFeedbackScrollableDiv"
                    endMessage={<Typography style={{ textAlign: 'center' }}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {deleted_feedbacks && deleted_feedbacks.map((fb: Feedback) => (
                            <Card key={fb.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}>
                                    <Box className={styles.header}>
                                        <Typography variant="h6">{fb.title}</Typography>
                                        <Typography className={styles.deletedText}>
                                            Deleted
                                        </Typography>
                                    </Box>

                                    <Typography className={styles.description}>
                                        {fb.description}
                                    </Typography>

                                    <Box className={styles.tagsContainer}>
                                        <Typography>Tags:</Typography>
                                        <Box className={styles.tags}>
                                            {fb.tags.map((tag) => (
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

                                        {fb.deleted_at && (
                                            <Typography>
                                                Deleted:{" "}
                                                {new Date(
                                                    fb.deleted_at
                                                ).toLocaleString()}
                                            </Typography>
                                        )}
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
