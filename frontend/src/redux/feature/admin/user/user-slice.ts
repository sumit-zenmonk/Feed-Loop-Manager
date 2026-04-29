"use client"

import { createSlice } from "@reduxjs/toolkit"
import { UserState } from "./user-type"
import { enableDisableUser, fetchUsers, fetchhiddenFeedbacks } from "./user-action"

const initialState: UserState = {
    hidden_feedbacks: [],
    total_hidden_feedbacks: 0,
    users: [],
    total_users: 0,
    loading: false,
    error: null,
    status: "pending",
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetUserState: (state) => {
            state.users = []
            state.total_users = 0
            state.loading = false
            state.error = null
            state.status = "pending"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                const newUsers = action.payload.users

                if (action.meta.arg.offset === 0) {
                    state.users = newUsers
                } else {
                    const merged = [...state.users, ...newUsers]
                    state.users = Array.from(new Map(merged.map(user => [user.uuid, user])).values())
                }
                state.total_users = action.payload.total
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(enableDisableUser.fulfilled, (state, action) => {
                const user = state.users.find((u) => u.uuid === action.meta.arg.uuid)
                if (user) {
                    user.is_disabled_by_admin = !user.is_disabled_by_admin
                }
            })
            .addCase(fetchhiddenFeedbacks.fulfilled, (state, action) => {
                const newFeedbacks = action.payload.feedbacks
                if (action.meta.arg.offset === 0) {
                    state.hidden_feedbacks = newFeedbacks
                } else {
                    const merged = [...state.hidden_feedbacks, ...newFeedbacks]
                    state.hidden_feedbacks = Array.from(
                        new Map(merged.map(fb => [fb.uuid, fb])).values()
                    )
                }
                state.total_hidden_feedbacks = action.payload.total
            })
    },
})

export const { resetUserState } = userSlice.actions
export default userSlice.reducer