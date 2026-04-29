import { BadRequestException, Injectable } from "@nestjs/common";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { CreateFeedbackCommentDto } from "./dto/feedback-comment.create.dto";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { FeedbackCommentRepository } from "src/infrastructure/repository/feedback.comment.repo";
import { UpdateFeedbackCommentDto } from "./dto/feedback-comment.update.dto";

@Injectable()
export class UserFeedbackCommentService {
    constructor(
        private readonly feedbackCommentRepo: FeedbackCommentRepository
    ) { }

    async createFeedbackComment(body: CreateFeedbackCommentDto, user: UserEntity) {
        return await this.feedbackCommentRepo.createComment(body, user.uuid);
    }

    async deleteFeedbackComment(uuid: string) {
        const isCommentExists = await this.feedbackCommentRepo.getcomment(uuid);
        if (!isCommentExists || !isCommentExists.length) {
            throw new BadRequestException("comment not found");
        }

        await this.feedbackCommentRepo.deleteComment(uuid);

        return {
            "message": "Comment Deleted Success"
        }
    }

    async updateFeedbackComment(body: UpdateFeedbackCommentDto) {
        const isCommentExists = await this.feedbackCommentRepo.getcomment(body.uuid);
        if (!isCommentExists || !isCommentExists.length) {
            throw new BadRequestException("comment not found");
        }

        await this.feedbackCommentRepo.updateComment(body.uuid, body);

        return {
            "message": "Comment updated Success"
        }
    }
}