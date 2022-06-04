import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class alterStatementsAddTransfer1650412522244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "statements" ADD COLUMN "sender_id" uuid;')
      await queryRunner.query("ALTER TYPE statements_type_enum ADD VALUE 'transfer';")
      await queryRunner.query(`
        ALTER TABLE "statements"
        ADD CONSTRAINT fk_statement_sender
        FOREIGN KEY(sender_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        ALTER TABLE "statements"
        DROP CONSTRAINT fk_statement_sender;
      `)

      await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "sender_id";`)
    }

}
