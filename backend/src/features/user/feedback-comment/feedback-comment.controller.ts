import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UserFeedbackCommentService } from "./feedback-comment.service";
import type { Request } from "express";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { UserRoleEnum } from "src/domain/enums/user";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { CreateFeedbackCommentDto } from "./dto/feedback-comment.create.dto";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller('/feedback/comment')
export class UserFeedbackCommentController {
    constructor(private readonly userFeedbackCommentService: UserFeedbackCommentService) { }

    @Post()
    async createFeedbackComment(@Body() body: CreateFeedbackCommentDto, @Req() req: Request) {
        return await this.userFeedbackCommentService.createFeedbackComment(body, req.user);
    }

    @Delete('/:uuid')
    async deleteFeedbackComment(@Req() req: Request, @Param('uuid') uuid: string) {
        return await this.userFeedbackCommentService.deleteFeedbackComment(uuid);
    }
}