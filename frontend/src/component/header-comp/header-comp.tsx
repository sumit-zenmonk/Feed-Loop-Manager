"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Menu, MenuItem } from "@mui/material"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import styles from "./header-comp.module.css"
import { UserRoleEnum } from "@/enums/user"

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.authReducer)

    const handleLogOut = async () => {
        await dispatch(logoutUser()).unwrap()
        localStorage.clear()
        router.replace("/")
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                <p onClick={() => {
                    router.push("/")
                }}>Feedloop Manager</p>
            </Box>

            <Box className={styles.rightContainer}>

                <Button
                    variant="outlined"
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    Home
                </Button>

                {user ? (
                    <>
                        {user.role == UserRoleEnum.USER && (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        router.push(`/user/feedback`)
                                    }}
                                >
                                    feedback
                                </Button>
                            </>
                        )}

                        {user.role == UserRoleEnum.ADMIN && (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        router.push(`/admin/user`)
                                    }}
                                >
                                    user
                                </Button>
                            </>
                        )}

                        <Button
                            variant="outlined"
                            sx={{ color: "#DB2D43", borderColor: "#DB2D43" }}
                            onClick={async () => {
                                await handleLogOut()
                            }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}