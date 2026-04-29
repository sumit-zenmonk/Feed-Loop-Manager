import { Injectable } from "@nestjs/common";
import { FeedbackEntity } from "src/domain/entities/feedback/feedback.entity";
import { FeedbackStatusEnum } from "src/domain/enums/feedback";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class FeedbackRepository extends Repository<FeedbackEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(FeedbackEntity, dataSource.createEntityManager());
    }

    async createFeedback(body: Partial<FeedbackEntity>) {
        const feedback = this.create(body);
        return await this.save(feedback);
    }

    async findByUuid(uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                comments: true,
                creator: true,
                votes: true,
                tags: true
            }
        });
        return user;
    }

    async findByTitle(title: string, creator_uuid: string) {
        const user = await this.findOne({
            where: {
                title: title,
                creator_uuid: creator_uuid
            },
            relations: {
                comments: true,
                creator: true,
                votes: true,
                tags: true
            }
        });
        return user;
    }

    async deleteFeedback(uuid: string) {
        return await this.softDelete(uuid);
    }

    async getUserFeedbacks(user_uuid: string, offset?: number, limit?: number) {
        return await this.findAndCount({
            where: {
                creator_uuid: user_uuid
            },
            relations: {
                comments: true,
                creator: true,
                votes: true,
                tags: true
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async getFeedbacks(offset?: number, limit?: number) {
        return await this.findAndCount({
            where: {
                status: FeedbackStatusEnum.PUBLIC,
                is_disabled_by_admin: false
            },
            relations: {
                comments: true,
                creator: true,
                votes: true,
                tags: true
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async updateFeedbackByUuid(uuid: string, payload: Partial<FeedbackEntity>) {
        await this.update({ uuid }, payload);
        return await this.findByUuid(uuid);
    }

    async disbaleEnableUserFeedback(admin_uuid: string, uuid: string, toggle: boolean) {
        return await this.update(
            { uuid: uuid },
            {
                disabled_by_admin_uuid: admin_uuid,
                is_disabled_by_admin: toggle
            }
        );
    }
}