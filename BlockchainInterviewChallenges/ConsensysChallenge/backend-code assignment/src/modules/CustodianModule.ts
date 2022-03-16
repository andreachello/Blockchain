import { HttpModule, Module, OnModuleInit, Provider } from '@nestjs/common'
import { EventStreamController } from '../controllers/EventStreamController'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import { AccountService } from '../services/AccountService'
import { TransactionMonitorService } from '../services/TransactionMonitorService'
import HDKeyring from 'eth-hd-keyring'
import { EthereumAccount } from '../data/entities/EthereumAccount'
import { ethers } from 'ethers'
import { ScheduleModule } from '@nestjs/schedule'
import { EventService } from '../services/EventService'
import { AccountController } from '../controllers/AccountController'
import { TransactionController } from '../controllers/TransactionController'
import { TransactionService } from '../services/TransactionService'
import { Logger } from '@nestjs/common'

require('dotenv').config()

const keyringProvider: Provider = {
  provide: 'KEYRING',
  useFactory: () => {
    // Create a new keyring from the mnemonic in the environment variables

    return new HDKeyring({
      mnemonic: process.env.MNEMONIC,
      numberOfAccounts: 3,
    })
  },
}

const rpcProvider: Provider = {
  provide: 'JSON_RPC_PROVIDER',
  useFactory: () => {
    return new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
  },
}

@Module({
  imports: [
    TypeOrmModule.forFeature([EthereumTransaction, EthereumAccount]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [
    AccountController,
    TransactionController,
    EventStreamController,
  ],
  providers: [
    AccountService,
    TransactionService,
    keyringProvider,
    rpcProvider,
    TransactionMonitorService,
    EventService,
  ],
})
export class CustodianModule implements OnModuleInit {
  constructor(private accountService: AccountService) {}

  async onModuleInit() {
    await this.accountService.addAccountsFromKeyring()

    Logger.log('Accounts synchronised')
  }
}
