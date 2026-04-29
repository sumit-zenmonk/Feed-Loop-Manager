import { Injectable } from "@nestjs/common";
import { FeedbackTagEntity } from "src/domain/entities/feedback/feedback.tag.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class FeedbackTagRepository extends Repository<FeedbackTagEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(FeedbackTagEntity, dataSource.createEntityManager());
    }

    async createMany(data: Partial<FeedbackTagEntity>[]) {
        const tags = this.create(data);
        return await this.save(tags);
    }
}