import { Controller, Get, HttpCode, Post } from '@nestjs/common'
import { Logger } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AccountService } from '../services/AccountService'
import { EthereumAccountWithBalance } from '../classes/EthereumAccountWithBalance'

require('dotenv').config()

export const VALID_HEALTHCHECK_MESSAGE = 'OK'

@ApiTags('Account')
@Controller('custodian')
export class AccountController {
  constructor(
    private readonly logger: Logger,
    private accountService: AccountService,
  ) {}

  @Post('synchronize')
  @HttpCode(200)
  @ApiOperation({
    description:
      'Synchronise the accounts in the database with the accounts that the keyring can create',
  })
  async addAccountsFromKeyring() {
    this.logger.log('Synchronising accounts')
    this.accountService.addAccountsFromKeyring()
    return null
  }

  @Get('account')
  @ApiOperation({ description: 'Get all the accounts' })
  @HttpCode(200)
  async getAccounts(): Promise<EthereumAccountWithBalance[]> {
    return this.accountService.getAccounts()
  }
}
