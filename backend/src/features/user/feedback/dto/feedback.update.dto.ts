import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsUUID, IsEnum } from 'class-validator';
import { FeedbackStatusEnum } from 'src/domain/enums/feedback';

export class UpdateFeedbackDto {
    @IsUUID()
    uuid: string;

    @IsString()
    @IsOptional()
    @MaxLength(34)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    description: string;

    @IsEnum(FeedbackStatusEnum)
    @IsOptional()
    status: FeedbackStatusEnum.PUBLIC;
}