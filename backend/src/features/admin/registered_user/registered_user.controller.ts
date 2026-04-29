import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RegisteredUserService } from "./registered_user.service";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { UserRoleEnum } from "src/domain/enums/user";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Controller('/user')
export class RegisteredUserController {
    constructor(private readonly registeredUserService: RegisteredUserService) { }

    @Get()
    async getRegisteredUsers(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.registeredUserService.getRegisteredUsers(req.user, offset, limit);
    }

    @Patch('account/status/:user_uuid')
    async disbaleEnableUserAccount(@Req() req: Request, @Param('user_uuid') user_uuid: string) {
        return this.registeredUserService.disbaleEnableUserAccount(req.user, user_uuid);
    }

    @Patch('feedback/status/:feedback_uuid')
    async disbaleEnableUserFeedback(@Req() req: Request, @Param('feedback_uuid') feedback_uuid: string) {
        return this.registeredUserService.disbaleEnableUserFeedback(req.user, feedback_uuid);
    }
}