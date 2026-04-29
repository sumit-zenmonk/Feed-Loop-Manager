import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UserFeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/feedback.create.dto";
import type { Request } from "express";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { UserRoleEnum } from "src/domain/enums/user";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { UpdateFeedbackDto } from "./dto/feedback.update.dto";
import { FeedbackVoteChangeDto } from "./dto/feedback.vote.change.dto";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller('/feedback')
export class UserFeedbackController {
    constructor(private readonly userFeedbackService: UserFeedbackService) { }

    @Post()
    async createFeedback(@Req() req: Request, @Body() body: CreateFeedbackDto) {
        return this.userFeedbackService.createFeedback(req.user, body);
    }

    @Delete('/:uuid')
    async deleteFeedback(@Req() req: Request, @Param("uuid") uuid: string) {
        return this.userFeedbackService.deleteFeedback(req.user, uuid);
    }

    @Get()
    async getFeedbacks(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.userFeedbackService.getFeedbacks(req.user, offset, limit);
    }

    @Patch('/:uuid')
    async updateFeedback(
        @Req() req: Request,
        @Param("uuid") uuid: string,
        @Body() body: UpdateFeedbackDto
    ) {
        return this.userFeedbackService.updateFeedback(req.user, uuid, body);
    }

    @Put('/vote')
    async createFeedbackVote(@Req() req: Request, @Body() body: FeedbackVoteChangeDto) {
        return this.userFeedbackService.createFeedbackVote(req.user, body);
    }
}