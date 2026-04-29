import { UserRoleEnum } from "src/domain/enums/user";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeedbackEntity } from "../feedback/feedback.entity";
import { FeedbackVoteEntity } from "../feedback/feedback.vote.entity";
import { FeedbackCommentEntity } from "../feedback/feedback.comment.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: true })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER,
        nullable: false
    })
    role: UserRoleEnum;

    @Column({ type: "boolean", default: false })
    is_disabled_by_admin: boolean

    @Column({ type: "uuid", nullable: true })
    disabled_by_admin_uuid: string;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'disabled_by_admin_uuid' })
    disabled_by_admin: UserEntity;

    @OneToMany(() => FeedbackEntity, (feedback) => feedback.creator)
    feedbacks: FeedbackEntity[];

    @OneToMany(() => FeedbackVoteEntity, (feedback_vote) => feedback_vote.user)
    votes: FeedbackVoteEntity[];

    @OneToMany(() => FeedbackCommentEntity, (feedback_comment) => feedback_comment.user)
    comments: FeedbackCommentEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}