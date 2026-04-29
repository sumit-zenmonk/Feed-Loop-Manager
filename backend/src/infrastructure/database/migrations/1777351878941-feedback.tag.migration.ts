import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class FeedbackTagMigration1777351878941 implements MigrationInterface {
    name = "FeedbackTagMigration1777351878941";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "feedback_tag",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "feedback_uuid", type: "uuid", isNullable: false },
                    { name: "tag_name", type: "varchar", length: "20", isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "feedback_tag",
            new TableForeignKey({
                name: "FK_FEEDBACK_TAG_FEEDBACK",
                columnNames: ["feedback_uuid"],
                referencedTableName: "feedback",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("feedback_tag", "FK_FEEDBACK_TAG_FEEDBACK");
        await queryRunner.dropTable("feedback_tag", true);
    }
}