import { UserRepository } from "src/infrastructure/repository/user.repo";
import { RegisterDto } from "./dto/register.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtHelperService } from "src/infrastructure/services/jwt.service";
import { BcryptService } from "src/infrastructure/services/bcrypt.service";
import { LoginDto } from "./dto/login.dto";
import { UserRoleEnum } from "src/domain/enums/user";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jwtHelperService: JwtHelperService,
        private readonly bcryptService: BcryptService
    ) { }

    async registerUser(body: RegisterDto) {
        //check if already exists using this email
        const isUserExistsWithEmail = await this.userRepo.findByEmail(body.email);
        if (isUserExistsWithEmail.length) {
            throw new BadRequestException('User Already Exists with this Email');
        }

        const isUserExistsWithUsername = await this.userRepo.findByEmailOrUserName(body.name);
        if (isUserExistsWithUsername) {
            throw new BadRequestException('User Already Exists with this UserName');
        }

        //hashed password using bcrypt
        body.password = await this.bcryptService.hashPassword(body.password);

        //register user in DB
        const RegisteredUser = await this.userRepo.register(body);

        // generate token for accessing resources
        const token = await this.jwtHelperService.generateJwtToken(RegisteredUser);
        return {
            message: "Registered User",
            access_token: token,
            user: {
                name: RegisteredUser.name,
                email: RegisteredUser.email,
                role: RegisteredUser.role,
                uid: RegisteredUser.uuid,
            }
        }
    }

    async loginUser(body: LoginDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepo.findByEmailOrUserName(body.email_or_username);
        if (!isUserExists) {
            throw new BadRequestException('User not Exists with this Email or Username');
        }

        if (isUserExists.is_disabled_by_admin) {
            throw new BadRequestException('Account disabled by Admin');
        }

        //matching password
        const isValid = await this.bcryptService.verifyPassword(body.password, isUserExists.password);
        if (!isValid) {
            throw new BadRequestException('Mismatched email or password');
        }

        const token = await this.jwtHelperService.generateJwtToken(isUserExists);
        return {
            message: "Logged In User",
            access_token: token,
            user: {
                name: isUserExists.name,
                email: isUserExists.email,
                role: isUserExists.role,
                uid: isUserExists.uuid,
            }
        }
    }
}