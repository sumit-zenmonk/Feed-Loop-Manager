import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";

@Injectable()
export class AdminFeedbackService {
    constructor(
        private readonly feedbackRepo: FeedbackRepository,
    ) { }

    async disbaleEnableUserFeedback(admin: UserEntity, feedback_uuid: string) {
        const isExistsAndActiveFeedback = await this.feedbackRepo.findByUuid(feedback_uuid);
        if (!isExistsAndActiveFeedback) {
            throw new BadRequestException("feedback not found");
        }

        await this.feedbackRepo.disbaleEnableUserFeedback(admin.uuid, feedback_uuid, !isExistsAndActiveFeedback[0]?.is_disabled_by_admin);

        return {
            message: "User Account Updated"
        }
    }

    async getInactiveFeedbacks(admin: UserEntity, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const [data, total] = await this.feedbackRepo.getInactiveFeedbacks(admin, curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Inactive Feedback Listing Success"
        }
    }
}