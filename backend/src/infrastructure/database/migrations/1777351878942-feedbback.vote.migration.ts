import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class FeedbackVoteMigration1777351878942 implements MigrationInterface {
    name = "FeedbackVoteMigration1777351878942";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "feedback_vote",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "feedback_uuid", type: "uuid", isNullable: false },
                    { name: "user_uuid", type: "uuid", isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "feedback_vote",
            new TableForeignKey({
                name: "FK_FEEDBACK_VOTE_FEEDBACK",
                columnNames: ["feedback_uuid"],
                referencedTableName: "feedback",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "feedback_vote",
            new TableForeignKey({
                name: "FK_FEEDBACK_VOTE_USER",
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("feedback_vote", "FK_FEEDBACK_VOTE_USER");
        await queryRunner.dropForeignKey("feedback_vote", "FK_FEEDBACK_VOTE_FEEDBACK");
        await queryRunner.dropTable("feedback_vote", true);
    }
}