"use client"

import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography, Stack, Box, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material"
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
import { FeedbackVoteEnum } from "@/enums/feedback";
import InactiveFeedbackModal from "@/component/inactive-feedback-modal-comp/inactive-feedback-modal-comp";

export default function Page() {
  const dispatch = useAppDispatch()
  const { feedbacks, total_feedbacks } = useAppSelector((state: RootState) => state.globalfeedbackReducer)
  const { user } = useAppSelector((state: RootState) => state.authReducer)
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const limit = 10
  const [textFilter, setTextFilter] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [userVotes, setUserVotes] = useState<Record<string, FeedbackVoteEnum | undefined>>({});
  const [openModal, setOpenModal] = useState(false);

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

  const allTags = Array.from(
    new Set(
      feedbacks.flatMap((fb: Feedback) => fb.tags.map((t: any) => t.tag_name))
    )
  );

  const filteredFeedbacks = feedbacks
    .filter((fb: Feedback) => {
      if (textFilter) {
        const text = (fb.title + " " + fb.description).toLowerCase();
        if (!text.includes(textFilter.toLowerCase())) return false;
      }

      if (selectedTags.length > 0) {
        if (!selectedTags.every(tag =>
          fb.tags.some((t: any) => t.tag_name === tag)
        )) return false;
      }

      return true;
    })
    .sort((a: Feedback, b: Feedback) => {
      const scoreA = a.votes.reduce((acc, v) => v.vote_type === FeedbackVoteEnum.UPVOTE ? acc + 1 : v.vote_type === FeedbackVoteEnum.DEVOTE ? acc - 1 : acc, 0);
      const scoreB = b.votes.reduce((acc, v) => v.vote_type === FeedbackVoteEnum.UPVOTE ? acc + 1 : v.vote_type === FeedbackVoteEnum.DEVOTE ? acc - 1 : acc, 0);

      return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });

  return (
    <Box className={styles.container}>
      <Box className={styles.filterBox}>
        <TextField
          size="small"
          placeholder="Search title/description"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value as string[])}
          >
            {allTags.map(tag => (
              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="desc">Desc</MenuItem>
            <MenuItem value="asc">Asc</MenuItem>
          </Select>
        </FormControl>

        {user?.role == UserRoleEnum.ADMIN && <Button
          variant="outlined"
          onClick={() => setOpenModal(true)}
        >
          View Hidden Feedbacks
        </Button>}
      </Box>

      <InfiniteScroll
        dataLength={filteredFeedbacks.length}
        next={fetchMore}
        hasMore={feedbacks.length < total_feedbacks}
        loader={<h4>Loading...</h4>}
        height={900}
        endMessage="None feedback left"
      >
        {filteredFeedbacks?.map((fb: Feedback) => {
          const myVote =
            userVotes[fb.uuid] ??
            fb.votes.find(v => v.user_uuid === user?.uid)?.vote_type;

          const score = fb.votes.reduce((acc, v) => {
            if (v.vote_type === FeedbackVoteEnum.UPVOTE) return acc + 1;
            if (v.vote_type === FeedbackVoteEnum.DEVOTE) return acc - 1;
            return acc;
          }, 0);

          return (
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
                  <Button onClick={() => router.push(`/global/feedback/${fb.uuid}`)}>
                    View
                  </Button>

                  {user?.role == UserRoleEnum.USER &&
                    <>
                      < Button
                        onClick={() => handleVote(fb.uuid, FeedbackVoteEnum.UPVOTE)}
                        sx={{
                          fontWeight: myVote === FeedbackVoteEnum.UPVOTE ? "bold" : "normal",
                          color: myVote === FeedbackVoteEnum.UPVOTE ? "green" : "gray"
                        }}
                      >
                        Upvote
                      </Button>

                      <Button
                        onClick={() => handleVote(fb.uuid, FeedbackVoteEnum.DEVOTE)}
                        sx={{
                          fontWeight: myVote === FeedbackVoteEnum.DEVOTE ? "bold" : "normal",
                          color: myVote === FeedbackVoteEnum.DEVOTE ? "red" : "gray"
                        }}
                      >
                        Devote
                      </Button>
                    </>
                  }
                </Box>

                <Box className={styles.footer}>
                  <Typography className={styles.meta}>
                    Created: {new Date(fb.created_at).toLocaleString()}
                  </Typography>

                  <Typography className={styles.meta}>
                    Votes: {fb.votes.length}
                  </Typography>

                  <Typography className={styles.meta}>
                    Score: {score}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </InfiniteScroll >

      <InactiveFeedbackModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={refresh}
      />
    </Box>
  )
}