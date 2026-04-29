"use client";

import { Card, CardContent, Typography, Stack, Box, Button, Modal, Collapse, Divider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import styles from "./feedback.module.css";
import { updateUserFeedbackVote, createUserFeedbackComment, deleteUserFeedbackComment } from "@/redux/feature/user/feedback/feedback-action";
import { fetchSpecificFeedback } from "@/redux/feature/global/feedback/feedback-action";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { FeedbackVoteEnum } from "@/enums/feedback";
import { enableDisableFeedback } from "@/redux/feature/admin/user/user-action";
import NestedComments from "@/component/nested-comment-comp/nested-comment-comp";
import { UserRoleEnum } from "@/enums/user";

export default function GlobalFeedbackPage() {
    const { feedbacks: userFeedbacks } = useAppSelector((state: RootState) => state.UserfeedbackReducer);
    const { feedbacks: globalFeedbacks } = useAppSelector((state: RootState) => state.globalfeedbackReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer)
    const dispatch = useAppDispatch()
    const { uuid } = useParams();
    const feedbackId = Array.isArray(uuid) ? uuid[0] : uuid;
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [doExpand, setDoExpand] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [userVotes, setUserVotes] = useState<Record<string, FeedbackVoteEnum | undefined>>({});

    const specific_feedback =
        userFeedbacks.find((fb) => fb.uuid === feedbackId) ||
        globalFeedbacks.find((fb) => fb.uuid === feedbackId);

    if (!specific_feedback) {
        return (
            <Box className={styles.center}>
                <Typography variant="h6">Feedback not found</Typography>
            </Box>
        );
    }

    const myVote = specific_feedback.votes.find(v => v.user_uuid === user?.uid)?.vote_type;

    const score = specific_feedback.votes.reduce((acc, v) => {
        if (v.vote_type === FeedbackVoteEnum.UPVOTE) return acc + 1;
        if (v.vote_type === FeedbackVoteEnum.DEVOTE) return acc - 1;
        return acc;
    }, 0);

    const handleVote = async (uuid: string, voteType: FeedbackVoteEnum) => {
        try {
            const currentVote = userVotes[uuid];
            const newVote = currentVote === voteType ? undefined : voteType;

            await dispatch(updateUserFeedbackVote({ feedback_uuid: uuid, vote_type: newVote })).unwrap()
            await dispatch(fetchSpecificFeedback({ uuid })).unwrap()

            setUserVotes(prev => ({
                ...prev,
                [uuid]: newVote
            }));
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleEnableDisableFeedback = async (uuid: string) => {
        try {
            await dispatch(enableDisableFeedback({ uuid })).unwrap();
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleAddComment = async (feedback_uuid: string, text: string, parentUuid?: string) => {
        try {
            if (!user) {
                enqueueSnackbar("login first", { variant: "error" });
                return;
            }

            if (!text.trim()) {
                enqueueSnackbar("empty comment", { variant: "error" });
                return;
            }

            await dispatch(createUserFeedbackComment({
                feedback_uuid,
                user_uuid: user!.uid,
                comment: text,
                comment_parent_uuid: parentUuid
            })).unwrap()

            await dispatch(fetchSpecificFeedback({ uuid: feedback_uuid }))
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        } finally {
            await dispatch(fetchSpecificFeedback({ uuid: feedback_uuid }))
        }
    }

    const handleDeleteComment = async (uuid: string) => {
        try {
            if (!user) {
                enqueueSnackbar("login first", { variant: "error" });
                return;
            }

            await dispatch(deleteUserFeedbackComment({ uuid })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.card}>
                <CardContent className={styles.content}>
                    <Box className={styles.header}>
                        <Typography variant="h5" className={styles.title}>
                            {specific_feedback.title}
                        </Typography>

                        <Typography className={styles.status}>
                            {specific_feedback.status}
                        </Typography>
                    </Box>

                    <Box className={styles.section}>
                        <Typography className={styles.sectionTitle}>
                            Description
                        </Typography>

                        <Typography className={styles.description}>
                            {specific_feedback.description}
                        </Typography>
                    </Box>

                    <Box className={styles.section}>
                        <Typography className={styles.sectionTitle}>
                            Tags
                        </Typography>

                        <Box className={styles.tagsContainer}>
                            {specific_feedback.tags.map((tag: any) => (
                                <Box key={tag.uuid} className={styles.tag}>
                                    <Typography className={styles.tagText}>
                                        {tag.tag_name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box className={styles.actionButtons}>

                        {user?.role == UserRoleEnum.USER &&
                            <>
                                <Button
                                    onClick={() => handleVote(specific_feedback.uuid, FeedbackVoteEnum.UPVOTE)}
                                    sx={{
                                        fontWeight: myVote === FeedbackVoteEnum.UPVOTE ? "bold" : "normal",
                                        color: myVote === FeedbackVoteEnum.UPVOTE ? "green" : "gray"
                                    }}
                                >
                                    Upvote
                                </Button>

                                <Button
                                    onClick={() => handleVote(specific_feedback.uuid, FeedbackVoteEnum.DEVOTE)}
                                    sx={{
                                        fontWeight: myVote === FeedbackVoteEnum.DEVOTE ? "bold" : "normal",
                                        color: myVote === FeedbackVoteEnum.DEVOTE ? "red" : "gray"
                                    }}
                                >
                                    Devote
                                </Button>
                            </>
                        }

                        {user?.role == UserRoleEnum.ADMIN &&
                            <Button
                                onClick={() => handleEnableDisableFeedback(specific_feedback.uuid)}
                            >
                                Hide Feedback
                            </Button>
                        }

                        <Button
                            onClick={() => setDoExpand((prev) => !prev)}
                        >
                            {doExpand ? "Hide" : "View"} Comments
                        </Button>

                        <Button onClick={handleOpen}>View Voters</Button>
                    </Box>

                    <Box className={styles.footer}>
                        <Typography className={styles.meta}>
                            Created: {new Date(specific_feedback.created_at).toLocaleString()}
                        </Typography>

                        <Typography className={styles.meta}>
                            Votes: {specific_feedback.votes.length}
                        </Typography>

                        <Typography className={styles.meta}>
                            Score: {score}
                        </Typography>
                    </Box>

                    <Modal open={open} onClose={handleClose} className={styles.modal}>
                        <Box>
                            {specific_feedback.votes?.map((vote: any) => (
                                <Box key={vote.uuid}>
                                    <Box className={styles.row}>
                                        <Typography>
                                            {vote.user.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Modal>

                    <Collapse in={doExpand}>
                        <Divider />
                        <Box>
                            <NestedComments
                                comments={specific_feedback.comments || []}
                                currentUser={{
                                    uuid: user?.uid || "",
                                    name: user?.name || "User",
                                    email: user?.email || "User",
                                }}
                                onAdd={(text, parentUuid) => handleAddComment(specific_feedback.uuid, text, parentUuid)}
                                onDelete={handleDeleteComment}
                            />
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>
        </Box>
    );
}