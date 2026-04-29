"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { Feedback, FetchFeedbackResponse } from "./feedback-type"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const fetchGlobalFeedbacks = createAsyncThunk<
    FetchFeedbackResponse,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "feedbacks/fetch",
    async ({ offset = 0, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const res = await fetch(
                `${API_URL}/feedback?offset=${offset}&limit=${limit}`,
                {
                    method: "GET"
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                feedbacks: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchSpecificFeedback = createAsyncThunk<
    any,
    { uuid: string },
    { state: RootState }
>(
    "global/feedback/fetch",
    async (payload, { getState, rejectWithValue }) => {
        try {

            const res = await fetch(
                `${API_URL}/feedback/${payload.uuid}`,
                {
                    method: "GET",
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)