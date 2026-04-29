import { Injectable } from "@nestjs/common";
import { FeedbackVoteEntity } from "src/domain/entities/feedback/feedback.vote.entity";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class FeedbackVoteRepository extends Repository<FeedbackVoteEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(FeedbackVoteEntity, dataSource.createEntityManager());
    }

    async createFeedbackVote(body: Partial<FeedbackVoteEntity>) {
        const feedbackVote = this.create(body);
        return await this.save(feedbackVote);
    }

    async findByFeedbackUuid(feedback_uuid: string, user_uuid: string) {
        const user = await this.findOne({
            where: {
                feedback_uuid: feedback_uuid,
                user_uuid: user_uuid
            },
        });
        return user;
    }

    async deleteFeedbackVote(uuid: string) {
        return await this.softDelete(uuid);
    }
}