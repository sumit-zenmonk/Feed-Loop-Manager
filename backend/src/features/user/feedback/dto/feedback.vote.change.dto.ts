import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { FeedbackVoteEnum } from 'src/domain/enums/feedback';

export class FeedbackVoteChangeDto {
    @IsUUID()
    feedback_uuid: string;

    @IsEnum(FeedbackVoteEnum)
    @IsOptional()
    vote_type: FeedbackVoteEnum;
}
