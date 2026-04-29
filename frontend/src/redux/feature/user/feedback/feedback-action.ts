"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { Feedback, FetchFeedbackResponse } from "./feedback-type"
import { FeedbackVoteEnum } from "@/enums/feedback";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const createUserFeedback = createAsyncThunk<
    Feedback,
    { title: string; description: string; tags: string[] },
    { state: RootState }
>(
    "user/feedback/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchUserFeedbacks = createAsyncThunk<
    FetchFeedbackResponse,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "user/feedback/fetch",
    async ({ offset = 0, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/user/feedback?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: { Authorization: token },
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

export const deleteUserFeedback = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "user/feedback/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/feedback/${uuid}`, {
                method: "DELETE",
                headers: { Authorization: token },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const updateUserFeedback = createAsyncThunk<
    Feedback,
    { uuid: string; title?: string; description?: string; status?: string },
    { state: RootState }
>(
    "user/feedback/update",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""
            const uuid = payload.uuid

            const res = await fetch(`${API_URL}/user/feedback/${uuid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const updateUserFeedbackVote = createAsyncThunk<
    Feedback,
    { feedback_uuid: string; vote_type?: FeedbackVoteEnum },
    { state: RootState }
>(
    "user/feedback/update/vote",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/feedback/vote`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const createUserFeedbackComment = createAsyncThunk<
    any,
    {
        feedback_uuid: string
        user_uuid: string
        comment: string
        comment_parent_uuid?: string
    },
    { state: RootState }
>(
    "user/feedback/comment/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/feedback/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteUserFeedbackComment = createAsyncThunk<
    { message: string; uuid: string },
    { uuid: string },
    { state: RootState }
>(
    "user/feedback/comment/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/feedback/comment/${uuid}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message, uuid }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)