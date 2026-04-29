import { BadRequestException, Injectable } from "@nestjs/common";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { CreateFeedbackCommentDto } from "./dto/feedback-comment.create.dto";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { FeedbackCommentRepository } from "src/infrastructure/repository/feedback.comment.repo";

@Injectable()
export class UserFeedbackCommentService {
    constructor(
        private readonly feedbackCommentRepo: FeedbackCommentRepository
    ) { }

    async createFeedbackComment(body: CreateFeedbackCommentDto, user: UserEntity) {
        return await this.feedbackCommentRepo.createComment(body, user.uuid);
    }

    async deleteFeedbackComment(uuid: string) {
        await this.feedbackCommentRepo.deleteComment(uuid);

        return {
            "message":"Comment Deleted Success"
        }
    }
}