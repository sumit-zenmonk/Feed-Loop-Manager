import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/feedback.create.dto";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { FeedbackTagRepository } from "src/infrastructure/repository/feedback.tag.repo";
import { UpdateFeedbackDto } from "./dto/feedback.update.dto";
import { FeedbackVoteChangeDto } from "./dto/feedback.vote.change.dto";
import { FeedbackVoteRepository } from "src/infrastructure/repository/feedback.vote.repo";

@Injectable()
export class UserFeedbackService {
    constructor(
        private readonly feedbackRepo: FeedbackRepository,
        private readonly feedbackTagRepo: FeedbackTagRepository,
        private readonly feedbackVoteRepo: FeedbackVoteRepository,
    ) { }

    async createFeedback(user: UserEntity, body: CreateFeedbackDto) {
        const isExistsWithName = await this.feedbackRepo.findByTitle(body.title, user.uuid);
        if (isExistsWithName) {
            throw new BadRequestException("Already Exists with this Title");
        }

        const newFeedback = await this.feedbackRepo.createFeedback({ title: body.title, description: body.description, creator_uuid: user.uuid });
        if (body.tags && body.tags.length) {
            const tagEntities = body.tags.map(tag => ({
                tag_name: tag,
                feedback_uuid: newFeedback.uuid,
            }));

            await this.feedbackTagRepo.createMany(tagEntities);
        }

        const createdFeedback = await this.feedbackRepo.findByUuid(newFeedback.uuid);
        return {
            message: "Feedback created",
            data: createdFeedback
        };
    }

    async deleteFeedback(user: UserEntity, uuid: string) {
        const isFeedbackExists = await this.feedbackRepo.findByUuid(uuid);
        if (!isFeedbackExists) {
            throw new BadRequestException("Feedback not found");
        }
        if (isFeedbackExists.creator_uuid !== user.uuid) {
            throw new BadRequestException("Not accessed to delete feedback of other");
        }

        await this.feedbackRepo.deleteFeedback(uuid);

        return {
            message: "Feedback deleted"
        };
    }

    async getFeedbacks(user: UserEntity, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const [data, total] = await this.feedbackRepo.getUserFeedbacks(user.uuid, curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Feedback Listing Success"
        }
    }

    async updateFeedback(user: UserEntity, uuid: string, body: UpdateFeedbackDto) {
        const feedback = await this.feedbackRepo.findByUuid(uuid);
        if (!feedback) {
            throw new BadRequestException("Feedback not found");
        }
        if (feedback.creator_uuid !== user.uuid) {
            throw new BadRequestException("Not allowed to update others feedback");
        }

        const updated = await this.feedbackRepo.updateFeedbackByUuid(uuid, body);
        return {
            message: "Feedback updated",
            data: updated
        };
    }

    async createFeedbackVote(user: UserEntity, body: FeedbackVoteChangeDto) {
        const isVoteExists = await this.feedbackVoteRepo.findByFeedbackUuid(body.feedback_uuid, user.uuid);
        if (isVoteExists) {
            await this.feedbackVoteRepo.deleteFeedbackVote(isVoteExists.uuid);
            return {
                message: "Feedback vote updated"
            };
        }

        await this.feedbackVoteRepo.createFeedbackVote({ feedback_uuid: body.feedback_uuid, user_uuid: user.uuid });
        return {
            message: "Feedback vote updated"
        };
    }
}