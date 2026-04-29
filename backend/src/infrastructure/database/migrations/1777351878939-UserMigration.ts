import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UsersMigration1777351878939 implements MigrationInterface {
    name = "UsersMigration1777351878939";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`
        );

        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar", isNullable: false, isUnique: true },
                    { name: "email", type: "varchar", isUnique: true, isNullable: false },
                    { name: "password", type: "varchar", isNullable: true },
                    { name: "role", type: "user_role_enum", default: `'user'`, isNullable: false },
                    { name: "is_disabled_by_admin", type: "boolean", default: false },
                    { name: "disabled_by_admin_uuid", type: "uuid", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "user",
            new TableForeignKey({
                name: "FK_USER_DISABLED_BY_ADMIN",
                columnNames: ["disabled_by_admin_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("user", "FK_USER_DISABLED_BY_ADMIN");
        await queryRunner.dropTable("user", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role_enum"`);
    }
}