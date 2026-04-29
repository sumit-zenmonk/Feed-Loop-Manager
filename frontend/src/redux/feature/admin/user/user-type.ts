export interface User {
    uuid: string
    name: string
    email: string
    password: string
    role: string
    is_disabled_by_admin: boolean
    disabled_by_admin_uuid: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchUsersResponse {
    users: User[]
    total: number
}

export interface UserState {
    users: User[]
    total_users: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}