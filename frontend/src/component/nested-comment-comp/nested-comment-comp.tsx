"use client";

import React from "react";
import { CommentSection } from "react-comments-section";
import "./comments-section.css";
import { Box } from "@mui/material";

interface User {
    uuid: string;
    name: string;
    email: string;
}

interface BackendComment {
    uuid: string;
    comment_parent_uuid: string | null;
    comment: string;
    user: User;
    created_at: string | Date;
}

interface MinimalCommentsProps {
    comments: BackendComment[];
    currentUser: User;
    onAdd: (text: string, parentUuid?: string) => Promise<void>;
    onDelete?: (uuid: string) => Promise<void>;
    onEdit?: (uuid: string, text: string) => Promise<void>;
}

export default function NestedComments({
    comments,
    currentUser,
    onAdd,
    onDelete,
    onEdit,
}: MinimalCommentsProps) {
    const mapComments = (all: BackendComment[]) => {
        const build = (parentId: string | null = null): any[] => {
            return all
                .filter((c) => c.comment_parent_uuid === parentId)
                .map((c) => {
                    const children = build(c.uuid);
                    return {
                        userId: String(c.user.uuid),
                        comId: c.uuid,
                        fullName: c.user.name,
                        parentId: c.comment_parent_uuid || null,
                        text: c.comment,
                        avatarUrl: 'https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
                        userProfile: "",
                        timestamp: new Date(c.created_at).toISOString(),
                        replies: children.flatMap((child: any) => [
                            child,
                            ...(child.replies || []),
                        ]),
                    }
                });
        };
        return build(null);
    };

    const customNoComment = () => (
        <Box>No comments wohoooo!</Box>
    )

    return (
        <Box sx={{ "& .comment-section": { fontFamily: "inherit" } }}>
            <CommentSection
                currentUser={{
                    currentUserId: String(currentUser.uuid),// it should be used in String strict lib dependency
                    currentUserFullName: currentUser.name,
                    currentUserImg: 'https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
                    currentUserProfile: ''
                }}
                placeHolder='Write your comment...'
                customNoComment={() => customNoComment()}
                commentData={mapComments(comments)}
                onSubmitAction={(data: any) => onAdd(data.text, data.parentId || data.replyTo)}
                onReplyAction={(data: any) => onAdd(data.text, data.repliedToCommentId)}
                onDeleteAction={(data: any) => onDelete?.(data.comIdToDelete)}
                onEditAction={(data: any) => onEdit?.(data.comId, data.text)}
                logIn={{ loginLink: "#", signUpLink: "#" }}
                advancedInput={true}
            />
        </Box>
    );
}
