import { Inject, Injectable } from '@nestjs/common'
import { DataFieldsOnly } from '../utils/types'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Logger } from '@nestjs/common'
import HDKeyring from 'eth-hd-keyring'
import { EthereumAccount } from '../data/entities/EthereumAccount'
import UUIDHash from 'uuid-hash'
import hashwords from 'hashwords'
import { ethers } from 'ethers'
import { EthereumAccountWithBalance } from '../classes/EthereumAccountWithBalance'

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: Logger,

    @InjectRepository(EthereumAccount)
    private ethereumAccountRepository: Repository<EthereumAccount>,

    @Inject('KEYRING')
    private keyring: HDKeyring,

    @Inject('JSON_RPC_PROVIDER')
    private rpcProvider: ethers.providers.JsonRpcProvider,
  ) {}

  // Get all the stored ethereum accounts

  async getAccounts(): Promise<EthereumAccountWithBalance[]> {
    const accounts = await this.ethereumAccountRepository.find()

    const accountsWithBalances: EthereumAccountWithBalance[] = []

    for (const account of accounts) {
      const balance = await this.rpcProvider.getBalance(account.address)

      accountsWithBalances.push({
        balance: balance.toString(),
        id: account.id,
        label: account.label,
        address: account.address,
        chainId: account.chainId,
      })
    }

    return accountsWithBalances
  }

  // Get a single account by ID

  async getAccount(id: string): Promise<EthereumAccount> {
    return await this.ethereumAccountRepository.findOne(id)
  }

  // Basically, get the accounts in the keyring and put them in the database

  async addAccountsFromKeyring(): Promise<void> {
    const accounts = (await this.keyring.getAccounts()) as string[]

    for (const address of accounts) {
      this.logger.log(`Account ${address}`)

      let account: DataFieldsOnly<EthereumAccount>

      account = await this.ethereumAccountRepository.findOne({
        where: { address },
      })

      if (!account) {
        const hw = hashwords()

        const id = UUIDHash.createHash().update(address).digest()

        account = {
          address,
          label: hw.hashStr(address),
          chainId: 4,
          ethereumTransactions: null,
        }

        account = await this.ethereumAccountRepository.save({ ...account, id })
        this.logger.log(account)
      }
    }
  }
}
