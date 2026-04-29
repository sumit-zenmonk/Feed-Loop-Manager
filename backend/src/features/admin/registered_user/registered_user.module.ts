import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { RegisteredUserService } from "./registered_user.service";
import { RegisteredUserController } from "./registered_user.controller";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";

@Module({
    imports: [],
    controllers: [RegisteredUserController],
    providers: [UserRepository, RegisteredUserService, FeedbackRepository],
    exports: [RegisteredUserModule],
})

export class RegisteredUserModule { }