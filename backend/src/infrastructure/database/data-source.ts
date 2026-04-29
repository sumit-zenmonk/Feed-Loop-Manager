//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/domain/entities/user/user.entity";
import { FeedbackEntity } from "src/domain/entities/feedback/feedback.entity";
import { FeedbackTagEntity } from "src/domain/entities/feedback/feedback.tag.entity";
import { FeedbackVoteEntity } from "src/domain/entities/feedback/feedback.vote.entity";
import { FeedbackCommentEntity } from "src/domain/entities/feedback/feedback.comment.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, FeedbackEntity, FeedbackTagEntity, FeedbackVoteEntity, FeedbackCommentEntity
    ],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export { dataSource, options };