"use client"

import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography, Stack, Box, TextField } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import { RootState } from "@/redux/store"
import { enqueueSnackbar } from "notistack"
import { Feedback } from "@/redux/feature/user/feedback/feedback-type"
import { fetchGlobalFeedbacks, fetchSpecificFeedback } from "@/redux/feature/global/feedback/feedback-action"
import styles from "./home.module.css";
import { useRouter } from "next/navigation"
import { updateUserFeedbackVote } from "@/redux/feature/user/feedback/feedback-action"
import { UserRoleEnum } from "@/enums/user"
import InfiniteScroll from "react-infinite-scroll-component"

export default function Page() {
  const dispatch = useAppDispatch()
  const { feedbacks, total_feedbacks } = useAppSelector((state: RootState) => state.globalfeedbackReducer)
  const { user } = useAppSelector((state: RootState) => state.authReducer)
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const limit = 10
  const [tagFilter, setTagFilter] = useState("")

  useEffect(() => {
    refresh()
  }, [dispatch])

  const refresh = async () => {
    try {
      await dispatch(fetchGlobalFeedbacks({})).unwrap()
    } catch (err: any) {
      console.log(err)
      enqueueSnackbar(err, { variant: "warning" })
    }
  }

  const handleVoteDevote = async (uuid: string) => {
    try {
      await dispatch(updateUserFeedbackVote({ feedback_uuid: uuid })).unwrap()
      await dispatch(fetchSpecificFeedback({ uuid })).unwrap()
    } catch (err: any) {
      console.log(err)
      enqueueSnackbar(err, { variant: "error" })
      if (err == 'Unauthorized') {
        router.push('/login');
      }
    }
  }

  const fetchMore = async () => {
    try {
      if (feedbacks.length >= total_feedbacks) return;

      const newOffset = offset + limit;
      setOffset(newOffset);

      await dispatch(fetchGlobalFeedbacks({ offset: newOffset, limit })).unwrap()
    } catch (err: any) {
      enqueueSnackbar(err, { variant: "error" });
      console.log(`Feedback List Fetching Error`, err);
    }
  }

  const filteredFeedbacks = tagFilter
    ? feedbacks.filter((fb: Feedback) =>
      fb.tags.some((tag: any) =>
        tag.tag_name.toLowerCase().includes(tagFilter.toLowerCase())
      )
    )
    : feedbacks

  return (
    <>
      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </Box>

      <InfiniteScroll
        dataLength={filteredFeedbacks.length}
        next={fetchMore}
        hasMore={feedbacks.length <= total_feedbacks}
        loader={<h4>Loading...</h4>}
        height={900}
      >
        {filteredFeedbacks?.map((fb: Feedback) => (
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
    </>
  )
}