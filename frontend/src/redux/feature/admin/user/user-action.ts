"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "@/redux/store"
import { FetchUsersResponse } from "./user-type"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const fetchUsers = createAsyncThunk<
    FetchUsersResponse,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "admin/users/fetch",
    async ({ offset = 0, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/admin/user?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                users: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const enableDisableUser = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "admin/users/enable-disable",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/admin/user/account/status/${uuid}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message, uuid }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const enableDisableFeedback = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "admin/feedback/enable-disable",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/admin/feedback/status/${uuid}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message, uuid }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchInactiveFeedbacks = createAsyncThunk<
    FetchInactiveFeedbackResponse,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "admin/inactive/feedbacks/fetch",
    async ({ offset = 0, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/admin/feedback/inactive?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            console.log(data);
            return {
                feedbacks: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)