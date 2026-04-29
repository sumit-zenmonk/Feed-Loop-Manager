import { Module } from "@nestjs/common";
import { UserFeedbackModule } from "./feedback/feedback.module";
import { RouterModule } from "@nestjs/core";

@Module({
    imports: [
        UserFeedbackModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: UserFeedbackModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }