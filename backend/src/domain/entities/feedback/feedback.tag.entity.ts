import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeedbackEntity } from "./feedback.entity";

@Entity('feedback_tag')
export class FeedbackTagEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    feedback_uuid: string

    @Column({ length: 20, nullable: false })
    tag_name: string;

    @ManyToOne(() => FeedbackEntity, (feedback) => feedback.tags)
    @JoinColumn({ name: "feedback_uuid" })
    feedback: FeedbackEntity

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}