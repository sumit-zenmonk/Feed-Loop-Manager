import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeedbackEntity } from "./feedback.entity";
import { UserEntity } from "../user/user.entity";

@Entity('feedback_comment')
export class FeedbackCommentEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    feedback_uuid: string

    @Column({ type: "uuid", nullable: false })
    user_uuid: string

    @Column({ type: "uuid", nullable: true })
    comment_parent_uuid: string

    @Column({ length: 100, nullable: false })
    comment: string;

    @ManyToOne(() => FeedbackEntity, (feedback) => feedback.comments)
    @JoinColumn({ name: "feedback_uuid" })
    feedback: FeedbackEntity;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @ManyToOne(() => FeedbackCommentEntity, { nullable: true })
    @JoinColumn({ name: "comment_parent_uuid" })
    parent: FeedbackCommentEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}