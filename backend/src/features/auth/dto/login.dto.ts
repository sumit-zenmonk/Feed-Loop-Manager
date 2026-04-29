import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/domain/enums/user';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    email_or_username: string;

    @IsString()
    @MinLength(3)
    password: string;

    // @IsEnum(Role)
    // role: Role.USER;
}