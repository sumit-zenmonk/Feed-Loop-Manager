import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateFeedbackCommentDto {
    @IsUUID()
    feedback_uuid: string;

    @IsUUID()
    user_uuid: string;

    @IsUUID()
    @IsOptional()
    comment_parent_uuid: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    comment: string;
}
