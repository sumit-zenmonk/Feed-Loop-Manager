export interface FeedbackUser {
    uuid: string
    name: string
    email: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Feedback {
    uuid: string
    title: string
    description: string
    creator_uuid: string
    status: string
    creator: FeedbackUser
    votes: any[]
    comments: any[]
    tags: any[]
    is_disabled_by_admin: boolean
    disabled_by_admin_uuid: string
    disabled_by_admin: FeedbackUser
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchFeedbackResponse {
    feedbacks: Feedback[]
    total: number
}

export interface FeedbackState {
    feedbacks: Feedback[]
    total_feedbacks: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}