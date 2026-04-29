import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeedbackEntity } from "./feedback.entity";
import { UserEntity } from "../user/user.entity";

@Entity('feedback_vote')
export class FeedbackVoteEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    feedback_uuid: string

    @Column({ type: "uuid", nullable: false })
    user_uuid: string

    @ManyToOne(() => FeedbackEntity, (feedback) => feedback.votes)
    @JoinColumn({ name: "feedback_uuid" })
    feedback: FeedbackEntity;

    @ManyToOne(() => UserEntity, (user) => user.votes, { eager: true })
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}