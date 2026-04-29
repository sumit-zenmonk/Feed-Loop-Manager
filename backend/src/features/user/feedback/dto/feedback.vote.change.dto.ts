import { IsUUID } from 'class-validator';

export class FeedbackVoteChangeDto {
    @IsUUID()
    feedback_uuid: string;
}
