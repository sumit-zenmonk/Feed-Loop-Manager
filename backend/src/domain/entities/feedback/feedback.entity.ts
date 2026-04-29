import { FeedbackStatusEnum } from "src/domain/enums/feedback";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { FeedbackTagEntity } from "./feedback.tag.entity";
import { FeedbackVoteEntity } from "./feedback.vote.entity";
import { FeedbackCommentEntity } from "./feedback.comment.entity";

@Entity('feedback')
export class FeedbackEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ length: 34, nullable: false })
    title: string;

    @Column({ length: 200, nullable: false })
    description: string;

    @Column({ type: "uuid", nullable: false })
    creator_uuid: string

    @Column({
        type: 'enum',
        enum: FeedbackStatusEnum,
        default: FeedbackStatusEnum.PUBLIC,
        nullable: false
    })
    status: FeedbackStatusEnum;

    @ManyToOne(() => UserEntity, (user) => user.feedbacks)
    @JoinColumn({ name: "creator_uuid" })
    creator: UserEntity

    @OneToMany(() => FeedbackTagEntity, (tag) => tag.feedback)
    tags: FeedbackTagEntity[];

    @OneToMany(() => FeedbackVoteEntity, (vote) => vote.feedback)
    votes: FeedbackVoteEntity[];

    @OneToMany(() => FeedbackCommentEntity, (comment) => comment.feedback)
    comments: FeedbackCommentEntity[];

    @Column({ type: "boolean", default: false })
    is_disabled_by_admin: boolean

    @Column({ type: "uuid", nullable: true })
    disabled_by_admin_uuid: string;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'disabled_by_admin_uuid' })
    disabled_by_admin: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}