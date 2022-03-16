import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { EthereumTransaction } from './EthereumTransaction'

@Entity()
export class EthereumAccount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  address: string

  @Column({ nullable: true })
  label: string

  @Column({ nullable: true })
  chainId: number

  @OneToMany(() => EthereumTransaction, (tx) => tx.ethereumAccount)
  ethereumTransactions: EthereumTransaction
}
