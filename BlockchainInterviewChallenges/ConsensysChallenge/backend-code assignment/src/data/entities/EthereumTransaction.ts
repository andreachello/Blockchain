import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { EthereumAccount } from './EthereumAccount'

@Entity()
export class EthereumTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  transactionHash: string

  @Column({ nullable: true })
  transactionStatus: string

  @Column({ nullable: true })
  createdTimestamp: Date

  @Column({ nullable: true })
  submittedTimestamp: Date

  @Column({ nullable: true })
  signedTimestamp: Date

  @Column({ nullable: true })
  abortedTimestamp: Date

  @Column({ nullable: true })
  failedTimestamp: Date

  @Column({ nullable: true })
  minedTimestamp: Date

  @Column({ nullable: true })
  failureReason: string

  @Column({ nullable: true })
  to: string

  @Column({ nullable: true })
  from: string

  @Column({ nullable: true })
  value: string

  @Column({ nullable: true })
  data: string

  @Column({ nullable: true })
  gasUsed: string

  @Column({ nullable: true })
  fees: string

  @Column({ nullable: true })
  gasLimit: string

  @Column({ nullable: true })
  gasPrice?: string

  @Column({ nullable: true })
  maxPriorityFeePerGas?: string

  @Column({ nullable: true })
  maxFeePerGas?: string

  @Column({ nullable: true })
  network: string

  @Column({ nullable: true })
  nonce: string

  @Column({ nullable: true })
  signedRawTransaction: string

  @ManyToOne(() => EthereumAccount, (account) => account.ethereumTransactions, {
    eager: true,
  })
  ethereumAccount: EthereumAccount

  @Column({ nullable: true })
  userId: string

  @Column({ nullable: true })
  type: string
}
