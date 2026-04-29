import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class FeedbackCommentMigration1777351878943 implements MigrationInterface {
    name = "FeedbackCommentMigration1777351878943";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "feedback_comment",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "feedback_uuid", type: "uuid", isNullable: false },
                    { name: "user_uuid", type: "uuid", isNullable: false },
                    { name: "comment_parent_uuid", type: "uuid", isNullable: true },
                    { name: "comment", type: "varchar", length: "100", isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "feedback_comment",
            new TableForeignKey({
                name: "FK_FEEDBACK_COMMENT_FEEDBACK",
                columnNames: ["feedback_uuid"],
                referencedTableName: "feedback",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "feedback_comment",
            new TableForeignKey({
                name: "FK_FEEDBACK_COMMENT_USER",
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "feedback_comment",
            new TableForeignKey({
                name: "FK_FEEDBACK_COMMENT_PARENT",
                columnNames: ["comment_parent_uuid"],
                referencedTableName: "feedback_comment",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("feedback_comment", "FK_FEEDBACK_COMMENT_PARENT");
        await queryRunner.dropForeignKey("feedback_comment", "FK_FEEDBACK_COMMENT_USER");
        await queryRunner.dropForeignKey("feedback_comment", "FK_FEEDBACK_COMMENT_FEEDBACK");
        await queryRunner.dropTable("feedback_comment", true);
    }
}