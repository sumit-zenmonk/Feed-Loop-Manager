import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RegisteredUserModule } from "./registered_user/registered_user.module";
import { AdminFeedbackModule } from "./feedback/feedback.module";

@Module({
    imports: [
        RegisteredUserModule,
        AdminFeedbackModule,
        RouterModule.register([
            {
                path: 'admin',
                children: [
                    { path: '/', module: RegisteredUserModule },
                    { path: '/', module: AdminFeedbackModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [AdminModule],
})

export class AdminModule { }