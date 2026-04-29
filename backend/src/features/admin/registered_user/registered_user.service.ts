import { UserRepository } from "src/infrastructure/repository/user.repo";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user/user.entity";

@Injectable()
export class RegisteredUserService {
    constructor(
        private readonly userRepo: UserRepository,
    ) { }

    async getRegisteredUsers(admin: UserEntity, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const [data, total] = await this.userRepo.getRegisteredUsers(curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "User Listing Success"
        }
    }
    async disbaleEnableUserAccount(admin: UserEntity, user_uuid: string) {
        const isExistsAndActiveUser = await this.userRepo.findByUuid(user_uuid);
        if (!isExistsAndActiveUser.length) {
            throw new BadRequestException("account not found");
        }

        await this.userRepo.disbaleEnableUserAccount(admin.uuid, user_uuid, !isExistsAndActiveUser[0].is_disabled_by_admin);

        return {
            message: "User Account Updated"
        }
    }
}