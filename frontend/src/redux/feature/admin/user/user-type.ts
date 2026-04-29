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

export interface Feedback {
    uuid: string
    title: string
    description: string
    creator_uuid: string
    status: string
    creator: User
    votes: any[]
    comments: any[]
    tags: any[]
    is_disabled_by_admin: boolean
    disabled_by_admin_uuid: string
    disabled_by_admin: User
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchInactiveFeedbackResponse {
    feedbacks: Feedback[]
    total: number
}

export interface UserState {
    inactive_feedbacks: InactiveFeedback[]
    total_inactive_feedbacks: number
    users: User[]
    total_users: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}