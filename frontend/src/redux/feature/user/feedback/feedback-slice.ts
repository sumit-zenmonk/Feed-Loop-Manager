"use client"

import { createSlice } from "@reduxjs/toolkit"
import { FeedbackState } from "./feedback-type"
import { createUserFeedback, createUserFeedbackComment, deleteUserFeedback, deleteUserFeedbackComment, fetchUserFeedbacks, updateUserFeedback, } from "./feedback-action"
import { fetchSpecificFeedback } from "../../global/feedback/feedback-action"

const initialState: FeedbackState = {
    feedbacks: [],
    total_feedbacks: 0,
    loading: false,
    error: null,
    status: "pending",
}

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        resetFeedbackState: (state) => {
            state.feedbacks = []
            state.total_feedbacks = 0
            state.loading = false
            state.error = null
            state.status = "pending"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUserFeedback.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(createUserFeedback.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.feedbacks.unshift(action.payload)
                state.total_feedbacks = state.feedbacks.length
            })
            .addCase(createUserFeedback.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchUserFeedbacks.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchUserFeedbacks.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                const newfeedbacks = action.payload.feedbacks

                if (action.meta.arg.offset === 0) {
                    state.feedbacks = newfeedbacks
                } else {
                    const merged = [...state.feedbacks, ...newfeedbacks]
                    state.feedbacks = Array.from(new Map(merged.map(feedback => [feedback.uuid, feedback])).values())
                }
                state.total_feedbacks = action.payload.total
            })
            .addCase(fetchUserFeedbacks.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(deleteUserFeedback.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(deleteUserFeedback.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const uuid = action.meta.arg.uuid
                state.feedbacks = state.feedbacks.filter(f => f.uuid !== uuid)
                state.total_feedbacks = state.feedbacks.length
            })
            .addCase(deleteUserFeedback.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(updateUserFeedback.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(updateUserFeedback.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const updated = action.payload
                const index = state.feedbacks.findIndex(f => f.uuid === updated.uuid)
                if (index !== -1) {
                    state.feedbacks[index] = updated
                }
            })
            .addCase(updateUserFeedback.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchSpecificFeedback.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchSpecificFeedback.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const updated = action.payload.data
                const index = state.feedbacks.findIndex((fb) => fb.uuid === updated.uuid)
                if (index !== -1) {
                    state.feedbacks[index] = updated
                }
            })
            .addCase(fetchSpecificFeedback.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(createUserFeedbackComment.pending, (state) => {
                state.loading = true
            })
            .addCase(createUserFeedbackComment.fulfilled, (state, action) => {
                state.loading = false
                const newComment = action.payload?.[0]
                if (!newComment) return

                const feedbackIndex = state.feedbacks.findIndex(
                    (f) => f.uuid === newComment.feedback_uuid
                )

                if (feedbackIndex !== -1) {
                    state.feedbacks[feedbackIndex].comments.push(newComment)
                }
            })
            .addCase(createUserFeedbackComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(deleteUserFeedbackComment.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteUserFeedbackComment.fulfilled, (state, action) => {
                state.loading = false
                const { uuid } = action.payload

                state.feedbacks.forEach((feedback) => {
                    feedback.comments = feedback.comments.filter(
                        (c: any) => c.uuid !== uuid
                    )
                })
            })
            .addCase(deleteUserFeedbackComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { resetFeedbackState } = feedbackSlice.actions
export default feedbackSlice.reducer