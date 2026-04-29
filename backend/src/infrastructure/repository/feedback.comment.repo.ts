import { Injectable } from "@nestjs/common";
import { FeedbackCommentEntity } from "src/domain/entities/feedback/feedback.comment.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class FeedbackCommentRepository extends Repository<FeedbackCommentEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(FeedbackCommentEntity, dataSource.createEntityManager());
    }

    async createComment(body: Partial<FeedbackCommentEntity>, user_uuid: string) {
        const Comment = await this.create({
            ...body,
            user_uuid: user_uuid
        });

        const comment = await this.save(Comment);

        return await this.getcomment(comment.uuid)
    }

    async getcomment(uuid: string) {
        return await this.find({
            where: {
                uuid
            }
            ,
            relations: {
                user: true,
                parent: true,
                feedback: true,
            }
        })
    }

    async deleteComment(uuid: string) {
        return await this.softDelete(uuid);
    }

    async updateComment(uuid: string, body: Partial<FeedbackCommentEntity>) {
        await this.update(uuid, body);
        return await this.getcomment(uuid);
    }
}