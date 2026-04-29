import { Module } from "@nestjs/common";
import { FeedbackRepository } from "src/infrastructure/repository/feedback.repo";
import { AdminFeedbackController } from "./feedback.controller";
import { AdminFeedbackService } from "./feedback.service";

@Module({
    imports: [],
    controllers: [AdminFeedbackController],
    providers: [AdminFeedbackService, FeedbackRepository],
    exports: [AdminFeedbackModule],
})

export class AdminFeedbackModule { }