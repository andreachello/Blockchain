import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  Delete,
} from '@nestjs/common'
import { JoiValidationPipe } from '../validation/JoiValidationPipe'
import { transactionSchema } from '../validation/transactionSchema'
import { Logger } from '@nestjs/common'
import { TransactionRequest } from '../requests/TransactionRequest'
import { TransactionStatusUpdateRequest } from '../requests/TransactionStatusUpdateRequest'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AccountService } from '../services/AccountService'
import { DataFieldsOnly } from '../utils/types'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import config from '../config'
import { TransactionService } from '../services/TransactionService'

require('dotenv').config()

export const VALID_HEALTHCHECK_MESSAGE = 'OK'

@ApiTags('Transaction')
@Controller('custodian')
export class TransactionController {
  constructor(
    private readonly logger: Logger,
    private accountService: AccountService,
    private transactionService: TransactionService,
  ) {}

  @Post(`transaction`)
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(transactionSchema))
  async createTransaction(@Body() request: TransactionRequest) {
    // FIXME
  }

  @Get(`transaction/:id`)
  @ApiOperation({ description: 'Get a single transaction by ID' })
  @HttpCode(200)
  async getTransaction(@Param('id') id: string) {
    // FIXME
  }

  @Get(`transaction`)
  @ApiOperation({ description: 'Get a transactions filtered by statuses' })
  @ApiQuery({
    name: 'transactionStatuses',
    description: 'transaction statuses to filter by (comma separated)',
  })
  @HttpCode(200)
  async getTransactions(
    // Accepts a comma separated list
    @Query('transactionStatuses') transactionStatuses?: string,
  ) {
    return null // FIXME
  }

  @Patch('transaction/:id')
  @ApiOperation({ description: 'Update the status of a transaction' })
  @HttpCode(200)
  async updateTransaction(
    @Param('id') id: string,
    @Body() request: TransactionStatusUpdateRequest,
  ): Promise<EthereumTransaction> {
    return null // FIXME
  }

  @Delete('/transaction')
  @HttpCode(200)
  @ApiOperation({ description: 'Delete a transaction (debug use)' })
  async deleteAllTransactions() {
    return null // FIXME
  }

  @Delete('/transaction/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Delete a transaction (debug use)' })
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(id)
  }
}
