import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpdateFeedbackCommentDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    comment: string;
}
