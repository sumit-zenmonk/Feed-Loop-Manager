import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { UserFeedbackController } from "./feedback.controller";
import { UserFeedbackService } from "./feedback.service";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { FeedbackTagRepository } from "src/infrastructure/repository/feedback.tag.repo";
import { FeedbackVoteRepository } from "src/infrastructure/repository/feedback.vote.repo";

@Module({
    imports: [],
    controllers: [UserFeedbackController],
    providers: [UserFeedbackService, FeedbackRepository, FeedbackTagRepository, FeedbackVoteRepository],
    exports: [UserFeedbackModule],
})

export class UserFeedbackModule { }