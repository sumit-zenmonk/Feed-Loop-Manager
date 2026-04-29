import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class FeedbackMigration1777351878940 implements MigrationInterface {
    name = "FeedbackMigration1777351878940";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."feedback_status_enum" AS ENUM('public', 'private')`
        );

        await queryRunner.createTable(
            new Table({
                name: "feedback",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "title", type: "varchar", length: "34", isNullable: false },
                    { name: "description", type: "varchar", length: "200", isNullable: false },
                    { name: "creator_uuid", type: "uuid", isNullable: false },
                    { name: "status", type: "feedback_status_enum", default: `'public'`, isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "feedback",
            new TableForeignKey({
                name: "FK_FEEDBACK_CREATOR",
                columnNames: ["creator_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("feedback", "FK_FEEDBACK_CREATOR");
        await queryRunner.dropTable("feedback", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."feedback_status_enum"`);
    }
}