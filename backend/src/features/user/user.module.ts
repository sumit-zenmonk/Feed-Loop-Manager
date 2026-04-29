import { Module } from "@nestjs/common";
import { UserFeedbackModule } from "./feedback/feedback.module";
import { RouterModule } from "@nestjs/core";
import { UserFeedbackCommentModule } from "./feedback-comment/feedback-comment.module";

@Module({
    imports: [
        UserFeedbackModule,
        UserFeedbackCommentModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: UserFeedbackModule },
                    { path: '/', module: UserFeedbackCommentModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }