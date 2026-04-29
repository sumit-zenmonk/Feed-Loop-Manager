"use client"

import React, { useEffect } from "react"
import { RootState } from "@/redux/store"
import styles from "./user.module.css"
import { Box, Typography, CircularProgress, Paper, Button, } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import { enableDisableUser, fetchUsers } from "@/redux/feature/admin/user/user-action"
import { enqueueSnackbar } from "notistack"
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component"

const UserList = () => {
    const dispatch = useAppDispatch()
    const { users, loading, error, total_users } = useAppSelector((state: RootState) => state.adminUserReducer)
    const [offset, setOffset] = useState(0);
    const limit = 10

    useEffect(() => {
        dispatch(fetchUsers({ offset: 0, limit: 10 }))
    }, [dispatch])

    if (loading) {
        return (
            <Box className={styles.center}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box className={styles.center}>
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    const fetchMore = async () => {
        try {
            if (users.length >= total_users) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchUsers({ offset: newOffset, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log(`User List Fetching Error`, err);
        }
    }

    const handleEnableDisable = async (uuid: string) => {
        try {
            await dispatch(enableDisableUser({ uuid })).unwrap();
        } catch (err: any) {
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Box className={styles.container}>
            <InfiniteScroll
                dataLength={users.length}
                next={fetchMore}
                hasMore={users.length < total_users}
                loader={<h4>Loading...</h4>}
                height={900}
            >
                {users.map((user: any) => (
                    <Paper key={user.uuid} className={styles.card}>
                        <Box className={styles.row}>
                            <Typography className={styles.name}>
                                {user.name}
                            </Typography>

                            <Typography className={styles.role}>
                                {user.role}
                            </Typography>
                        </Box>

                        <Typography className={styles.email}>
                            {user.email}
                        </Typography>

                        <Box className={styles.row}>
                            <Typography>
                                Joined {new Date(user.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>

                        <Box>
                            <Button
                                onClick={() => handleEnableDisable(user.uuid)}
                            >
                                {user.is_disabled_by_admin ? "Disabled" : "Active"}
                            </Button>
                        </Box>
                    </Paper>
                ))}

            </InfiniteScroll>
        </Box>
    )
}

export default UserList