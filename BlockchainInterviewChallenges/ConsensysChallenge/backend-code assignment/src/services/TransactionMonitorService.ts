import { Inject, Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import { Repository } from 'typeorm'
import { ethers } from 'ethers'
import { EventService } from './EventService'

@Injectable()
export class TransactionMonitorService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(EthereumTransaction)
    private ethereumTransactionRepository: Repository<EthereumTransaction>,
    @Inject('JSON_RPC_PROVIDER')
    private rpcProvider: ethers.providers.JsonRpcProvider,
    private eventService: EventService,
  ) {}

  @Cron('*/3 * * * * *')
  async update() {
    const unconfirmedTransactions = await this.ethereumTransactionRepository.find(
      { where: { transactionStatus: 'submitted' } },
    )

    for (const transaction of unconfirmedTransactions) {
      const result = await this.rpcProvider.getTransactionReceipt(
        transaction.transactionHash,
      )

      if (result) {
        if (result.status === 1) {
          transaction.transactionStatus = 'mined'
          transaction.minedTimestamp = new Date()
        } else if (result.status === 0) {
          transaction.transactionStatus = 'failed'
          transaction.failedTimestamp = new Date()
        }

        this.logger.log(
          `Transaction ${transaction.id} (${transaction.transactionHash}) updated to ${transaction.transactionStatus}`,
        )

        this.eventService.emitTransaction(transaction)

        await this.ethereumTransactionRepository.save(transaction)
      }
    }
  }
}
