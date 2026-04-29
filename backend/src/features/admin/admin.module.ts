import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RegisteredUserModule } from "./registered_user/registered_user.module";

@Module({
    imports: [
        RegisteredUserModule,
        RouterModule.register([
            {
                path: 'admin',
                children: [
                    { path: '/', module: RegisteredUserModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [AdminModule],
})

export class AdminModule { }