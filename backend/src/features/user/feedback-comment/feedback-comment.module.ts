import { Module } from "@nestjs/common";
import { UserFeedbackCommentController } from "./feedback-comment.controller";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { UserFeedbackCommentService } from "./feedback-comment.service";
import { FeedbackCommentRepository } from "src/infrastructure/repository/feedback.comment.repo";

@Module({
    imports: [],
    controllers: [UserFeedbackCommentController],
    providers: [UserFeedbackCommentService, FeedbackRepository, FeedbackCommentRepository],
    exports: [UserFeedbackCommentModule],
})

export class UserFeedbackCommentModule { }