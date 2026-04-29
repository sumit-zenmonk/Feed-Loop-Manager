"use client"

import { createSlice } from "@reduxjs/toolkit"
import { FeedbackState } from "./feedback-type"
import { fetchGlobalFeedbacks, fetchSpecificFeedback } from "./feedback-action"

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
            .addCase(fetchGlobalFeedbacks.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchGlobalFeedbacks.fulfilled, (state, action) => {
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
            .addCase(fetchGlobalFeedbacks.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchSpecificFeedback.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchSpecificFeedback.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload

                const index = state.feedbacks.findIndex(
                    (fb) => fb.uuid === updated.uuid
                )

                if (index !== -1) {
                    state.feedbacks[index] = updated
                }
            })
            .addCase(fetchSpecificFeedback.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetFeedbackState } = feedbackSlice.actions
export default feedbackSlice.reducer