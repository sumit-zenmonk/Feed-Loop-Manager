"use client"

import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography, Stack, Box, } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import FeedbackSchemaFormModal from "@/component/feedback-modal-comp/feedback-modal-comp"
import { RootState } from "@/redux/store"
import { deleteUserFeedback, fetchUserFeedbacks, updateUserFeedback, updateUserFeedbackVote } from "@/redux/feature/user/feedback/feedback-action"
import { enqueueSnackbar } from "notistack"
import { FeedbackStatusEnum } from "@/enums/feedback"
import { Feedback } from "@/redux/feature/user/feedback/feedback-type"
import { useRouter } from "next/navigation"
import styles from "./feedback.module.css";
import { fetchSpecificFeedback } from "@/redux/feature/global/feedback/feedback-action"
import InfiniteScroll from "react-infinite-scroll-component"

export default function UserFeedbBackPage() {
    const dispatch = useAppDispatch()
    const { feedbacks, total_feedbacks } = useAppSelector((state: RootState) => state.UserfeedbackReducer)
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [offset, setOffset] = useState(0);
    const limit = 10

    useEffect(() => {
        dispatch(fetchUserFeedbacks({}))
    }, [dispatch])

    const refresh = async () => {
        try {
            await dispatch(fetchUserFeedbacks({})).unwrap()
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "warning" })
        }
    }

    const handleDelete = async (uuid: string) => {
        try {
            await dispatch(deleteUserFeedback({ uuid })).unwrap()
            await refresh()
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleStatusUpdate = async (uuid: string, status: string) => {
        try {
            await dispatch(
                updateUserFeedback({
                    uuid: uuid,
                    status: FeedbackStatusEnum.PRIVATE == status ? FeedbackStatusEnum.PUBLIC : FeedbackStatusEnum.PRIVATE,
                })
            ).unwrap()
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleVoteDevote = async (uuid: string) => {
        try {
            await dispatch(updateUserFeedbackVote({ feedback_uuid: uuid })).unwrap()
            await dispatch(fetchSpecificFeedback({ uuid })).unwrap()
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const fetchMore = async () => {
        try {
            if (feedbacks.length >= total_feedbacks) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchUserFeedbacks({ offset: newOffset, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log(`Feedback List Fetching Error`, err);
        }
    }

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Create Feedback
            </Button>

            <InfiniteScroll
                dataLength={feedbacks.length}
                next={fetchMore}
                hasMore={feedbacks.length <= total_feedbacks}
                loader={<h4>Loading...</h4>}
                height={900}
            >
                {feedbacks?.map((fb: Feedback) => (
                    <Card key={fb.uuid} className={styles.card}>
                        <CardContent className={styles.content}>
                            <Box className={styles.header}>
                                <Typography variant="h5" className={styles.title}>
                                    {fb.title}
                                </Typography>

                                <Typography className={styles.status}>
                                    {fb.status}
                                </Typography>
                            </Box>

                            <Box className={styles.section}>
                                <Typography className={styles.sectionTitle}>
                                    Description
                                </Typography>

                                <Typography className={styles.description}>
                                    {fb.description}
                                </Typography>
                            </Box>

                            <Box className={styles.section}>
                                <Typography className={styles.sectionTitle}>
                                    Tags
                                </Typography>

                                <Box className={styles.tagsContainer}>
                                    {fb.tags.map((tag: any) => (
                                        <Box key={tag.uuid} className={styles.tag}>
                                            <Typography className={styles.tagText}>
                                                {tag.tag_name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Box className={styles.actionButtons}>
                                <Button
                                    onClick={() => router.push(`/global/feedback/${fb.uuid}`)}
                                >
                                    View
                                </Button>

                                <Button
                                    onClick={() => handleVoteDevote(fb.uuid)}
                                >
                                    vote/devote
                                </Button>

                                <Button
                                    onClick={() => handleStatusUpdate(fb.uuid, fb.status)}
                                >
                                    {fb.status}
                                </Button>

                                <Button
                                    color="error"
                                    onClick={() => handleDelete(fb.uuid)}
                                >
                                    Delete
                                </Button>
                            </Box>

                            <Box className={styles.footer}>
                                <Typography className={styles.meta}>
                                    Created: {new Date(fb.created_at).toLocaleString()}
                                </Typography>

                                <Typography className={styles.meta}>
                                    Votes: {fb.votes.length}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </InfiniteScroll>

            <FeedbackSchemaFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={refresh}
            />
        </>
    )
}