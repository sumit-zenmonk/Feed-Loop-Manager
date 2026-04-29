import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminFeedbackService } from "./feedback.service";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { UserRoleEnum } from "src/domain/enums/user";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Controller('/feedback')
export class AdminFeedbackController {
    constructor(private readonly adminFeedbackService: AdminFeedbackService) { }

    @Patch('status/:feedback_uuid')
    async disbaleEnableUserFeedback(@Req() req: Request, @Param('feedback_uuid') feedback_uuid: string) {
        return this.adminFeedbackService.disbaleEnableUserFeedback(req.user, feedback_uuid);
    }

    @Get('/hidden')
    async gethiddenFeedbacks(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.adminFeedbackService.gethiddenFeedbacks(req.user, offset, limit);
    }
}