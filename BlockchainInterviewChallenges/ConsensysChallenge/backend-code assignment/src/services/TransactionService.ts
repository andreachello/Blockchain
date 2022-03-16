import { Inject, Injectable } from '@nestjs/common'
import { DataFieldsOnly } from '../utils/types'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Logger } from '@nestjs/common'
import HDKeyring from 'eth-hd-keyring'
import { EthereumAccount } from '../data/entities/EthereumAccount'
import { ethers } from 'ethers'
import {
  Transaction,
  JsonTx,
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
} from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import { EventService } from './EventService'

@Injectable()
export class TransactionService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(EthereumTransaction)
    private ethereumTransactionRepository: Repository<EthereumTransaction>,
    @InjectRepository(EthereumAccount)
    private ethereumAccountRepository: Repository<EthereumAccount>,
    @Inject('KEYRING')
    private keyring: HDKeyring,

    @Inject('JSON_RPC_PROVIDER')
    private rpcProvider: ethers.providers.JsonRpcProvider,

    private eventService: EventService,
  ) {}

  // Create a new Ethereum transaction and save it to the database

  async createTransaction(
    transaction: DataFieldsOnly<EthereumTransaction>,
  ): Promise<EthereumTransaction> {
    this.logger.log('Creating transaction')
    this.logger.log(JSON.stringify(transaction))

    const saved = await this.ethereumTransactionRepository.save(transaction)
    this.eventService.emitTransaction(saved)
    return saved
  }

  // Get a single transaction by ID
  async getTransaction(id: string): Promise<EthereumTransaction> {
    return await this.ethereumTransactionRepository.findOne(id)
  }

  // Get all the transactions

  async getTransactions(
    transactionStatuses?: string,
  ): Promise<EthereumTransaction[]> {
    if (transactionStatuses) {
      const statuses = transactionStatuses.split(',')

      return await this.ethereumTransactionRepository.find({
        where: {
          transactionStatus: In(statuses),
        },
      })
    } else {
      return await this.ethereumTransactionRepository.find()
    }
  }

  // Sign an ethereum transaction with the keyring

  async signTransaction(ethereumTransaction: EthereumTransaction) {
    const account = await this.ethereumAccountRepository.findOne(
      ethereumTransaction.ethereumAccount.id,
    )

    const nonce = await this.rpcProvider.getTransactionCount(account.address)

    const txParams: JsonTx = {
      to: ethereumTransaction.to,
      nonce: ethers.utils.hexlify(nonce),
      value: ethers.utils.hexlify(BigInt(ethereumTransaction.value)),
      data: ethereumTransaction.data,
      gasLimit: ethers.utils.hexlify(BigInt(ethereumTransaction.gasLimit)),
      type: ethers.utils.hexlify(BigInt(ethereumTransaction.type)),
    }

    let tx: FeeMarketEIP1559Transaction | Transaction

    if (ethereumTransaction.type === '2') {
      const common = new Common({ chain: 'rinkeby', hardfork: 'london' }) // TODO: use chainId from account
      txParams.maxFeePerGas = ethers.utils.hexlify(
        BigInt(ethereumTransaction.maxFeePerGas),
      )
      txParams.maxPriorityFeePerGas = ethers.utils.hexlify(
        BigInt(ethereumTransaction.maxPriorityFeePerGas),
      )
      tx = FeeMarketEIP1559Transaction.fromTxData(
        txParams as FeeMarketEIP1559TxData,
        { common },
      )
    } else {
      const common = new Common({ chain: 'rinkeby', hardfork: 'istanbul' }) // TODO: use chainId from account
      txParams.gasPrice = ethers.utils.hexlify(
        BigInt(ethereumTransaction.gasPrice),
      )
      tx = Transaction.fromTxData(txParams as JsonTx, { common })
    }

    const signature = await this.keyring.signTransaction(account.address, tx)
    ethereumTransaction.signedRawTransaction =
      '0x' + signature.serialize().toString('hex')
    ethereumTransaction.signedTimestamp = new Date()
    ethereumTransaction.transactionStatus = 'signed'
    ethereumTransaction.nonce = nonce.toString()

    const saved = await this.ethereumTransactionRepository.save(
      ethereumTransaction,
    )
    this.eventService.emitTransaction(saved)
    return saved
  }

  // Submit a transaction to the blockchain to be mined

  async submitTransaction(ethereumTransaction: EthereumTransaction) {
    const result = await this.rpcProvider.sendTransaction(
      ethereumTransaction.signedRawTransaction,
    )

    // Technically, we know the transaction hash before it is submitted, but this is a convenient place to get it

    ethereumTransaction.transactionHash = result.hash
    ethereumTransaction.submittedTimestamp = new Date()
    ethereumTransaction.transactionStatus = 'submitted'

    const saved = await this.ethereumTransactionRepository.save(
      ethereumTransaction,
    )
    this.eventService.emitTransaction(saved)
    return saved
  }

  // Abort a transaction

  async abortTransaction(ethereumTransaction: EthereumTransaction) {
    ethereumTransaction.transactionStatus = 'aborted'
    ethereumTransaction.abortedTimestamp = new Date()

    const saved = await this.ethereumTransactionRepository.save(
      ethereumTransaction,
    )
    this.eventService.emitTransaction(saved)
    return saved
  }

  // Delete all the transactions

  async deleteAllTransactions() {
    return this.ethereumTransactionRepository.delete({})
  }

  // Delete a single transaction

  async deleteTransaction(id: string) {
    return this.ethereumTransactionRepository.delete(id)
  }
}
