import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(34)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @MaxLength(20, { each: true })
    tags?: string[];
}
