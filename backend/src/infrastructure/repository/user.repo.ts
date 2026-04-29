import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { UserRoleEnum } from "src/domain/enums/user";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: Partial<UserEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.find({
            where: {
                uuid: uuid
            },
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.find({
            where: {
                email: email
            },
        });
        return user;
    }

    async findByEmailOrUserName(email_or_username: string) {
        const user = await this.findOne({
            where: [
                { email: email_or_username },
                { name: email_or_username }
            ],
        });
        return user;
    }

    async getRegisteredUsers(offset: number, limit: number) {
        return await this.findAndCount({
            where: {
                role: UserRoleEnum.USER
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async disbaleEnableUserAccount(admin_uuid: string, user_uuid: string, toggle: boolean) {
        return await this.update(
            { uuid: user_uuid },
            {
                disabled_by_admin_uuid: admin_uuid,
                is_disabled_by_admin: toggle
            }
        );
    }
}