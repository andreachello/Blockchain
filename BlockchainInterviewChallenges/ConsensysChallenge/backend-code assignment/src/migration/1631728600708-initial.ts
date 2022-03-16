import { MigrationInterface, QueryRunner } from 'typeorm'

export class initial1631728600708 implements MigrationInterface {
  name = 'initial1631728600708'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "base_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "ethereum_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionHash" character varying, "transactionStatus" character varying, "createdTimestamp" TIMESTAMP, "submittedTimestamp" TIMESTAMP, "signedTimestamp" TIMESTAMP, "abortedTimestamp" TIMESTAMP, "failedTimestamp" TIMESTAMP, "minedTimestamp" TIMESTAMP, "failureReason" character varying, "to" character varying, "from" character varying, "value" character varying, "data" character varying, "gasUsed" character varying, "fees" character varying, "gasLimit" character varying, "gasPrice" character varying, "maxPriorityFeePerGas" character varying, "maxFeePerGas" character varying, "network" character varying, "nonce" character varying, "signedRawTransaction" character varying, "userId" character varying, "type" character varying, "ethereumAccountId" uuid, CONSTRAINT "PK_f2cbd054cbcf4809aa6c063ea27" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "ethereum_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying NOT NULL, "label" character varying, "chainId" integer, CONSTRAINT "PK_488c30fb9d741fa1bf040540b92" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "ethereum_transaction" ADD CONSTRAINT "FK_c0e075b339caf8d0807d3b0a003" FOREIGN KEY ("ethereumAccountId") REFERENCES "ethereum_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ethereum_transaction" DROP CONSTRAINT "FK_c0e075b339caf8d0807d3b0a003"`,
    )
    await queryRunner.query(`DROP TABLE "ethereum_account"`)
    await queryRunner.query(`DROP TABLE "ethereum_transaction"`)
    await queryRunner.query(`DROP TABLE "base_entity"`)
  }
}
