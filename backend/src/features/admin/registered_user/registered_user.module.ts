import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { RegisteredUserService } from "./registered_user.service";
import { RegisteredUserController } from "./registered_user.controller";

@Module({
    imports: [],
    controllers: [RegisteredUserController],
    providers: [UserRepository, RegisteredUserService],
    exports: [RegisteredUserModule],
})

export class RegisteredUserModule { }