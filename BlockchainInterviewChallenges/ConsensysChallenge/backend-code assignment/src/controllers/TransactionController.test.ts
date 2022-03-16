import { TransactionController } from './TransactionController'
import { Logger } from '@nestjs/common'
import createMockInstance from 'jest-create-mock-instance'
import { AccountService } from '../services/AccountService'
import Mocked = jest.Mocked
import { TransactionService } from '../services/TransactionService'
import { TransactionStatusUpdateRequest } from '../requests/TransactionStatusUpdateRequest'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'
import { TransactionRequest } from '../requests/TransactionRequest'
import config from '../config'

describe('TransactionController', () => {
  let logger: Logger
  let transactionService: Mocked<TransactionService>
  let accountService: Mocked<AccountService>
  let controller: TransactionController

  const mockTransactionTemplate: EthereumTransaction = {
    id: '123',
    transactionStatus: 'signed',
    createdTimestamp: null,
    abortedTimestamp: null,
    signedTimestamp: null,
    submittedTimestamp: null,
    failedTimestamp: null,
    minedTimestamp: null,
    failureReason: null,
    from: '0x',
    ethereumAccount: null,
    userId: null,
    createdAt: null,
    updatedAt: null,
    data: '0x',
    transactionHash: '0x',
    to: '0x',
    value: '0',
    gasUsed: '0',
    fees: '0',
    gasLimit: '0',
    nonce: '0',
    network: '0',
    signedRawTransaction: null,
    type: '2',
  }

  beforeEach(() => {
    logger = createMockInstance(Logger)
    transactionService = createMockInstance(TransactionService)
    accountService = createMockInstance(AccountService)
    controller = new TransactionController(
      logger,
      accountService,
      transactionService,
    )
    jest.resetAllMocks()
  })

  describe('createTransaction', () => {
    it('should accept a type 0 transaction request, and call the transaction service to create the transaction', async () => {
      const transactionRequest: TransactionRequest = {
        to: '0x0',
        accountId: '123',
        gasLimit: '0x5208',
        gasPrice: '0x1ef76af200',
        data: '0x0',
        value: '0x0',
        type: '0', // Type 0 transactions have a gasPrice
      }

      const mockAccount = {
        address: '0xFF',
        label: 'test',
        chainId: 1,
        ethereumTransactions: null,
        id: '123',
        createdAt: null,
        updatedAt: null,
      }

      accountService.getAccount.mockResolvedValueOnce(mockAccount)

      await controller.createTransaction(transactionRequest)

      expect(transactionService.createTransaction).toHaveBeenCalledWith({
        abortedTimestamp: null,
        createdTimestamp: expect.any(Date),
        data: transactionRequest.data,
        ethereumAccount: mockAccount,
        failedTimestamp: null,
        failureReason: null,
        fees: null,
        from: mockAccount.address,
        gasLimit: transactionRequest.gasLimit,
        gasPrice: transactionRequest.gasPrice,
        gasUsed: null,
        minedTimestamp: null,
        network: null,
        nonce: null,
        signedRawTransaction: null,
        signedTimestamp: null,
        submittedTimestamp: null,
        to: transactionRequest.to,
        transactionHash: null,
        transactionStatus: 'created',
        type: transactionRequest.type,
        userId: config().userUuid, // This is just a fixed ID to keep things simple
        value: transactionRequest.value,
      })
    })

    it('should be able to create a type 2 transaction', async () => {
      const transactionRequest: TransactionRequest = {
        to: '0x0',
        accountId: '123',
        gasLimit: '0x5208',
        maxPriorityFeePerGas: '0x1ef76af20',
        maxFeePerGas: '0x1ef76af200',
        data: '0x0',
        value: '0x0',
        type: '2', // Type 0 transactions have a gasPrice
      }

      const mockAccount = {
        address: '0xFF',
        label: 'test',
        chainId: 1,
        ethereumTransactions: null,
        id: '123',
        createdAt: null,
        updatedAt: null,
      }

      accountService.getAccount.mockResolvedValueOnce(mockAccount)

      await controller.createTransaction(transactionRequest)

      expect(transactionService.createTransaction).toHaveBeenCalledWith({
        abortedTimestamp: null,
        createdTimestamp: expect.any(Date),
        data: transactionRequest.data,
        ethereumAccount: mockAccount,
        failedTimestamp: null,
        failureReason: null,
        fees: null,
        from: mockAccount.address,
        gasLimit: transactionRequest.gasLimit,
        maxPriorityFeePerGas: transactionRequest.maxPriorityFeePerGas,
        maxFeePerGas: transactionRequest.maxFeePerGas,
        gasUsed: null,
        minedTimestamp: null,
        network: null,
        nonce: null,
        signedRawTransaction: null,
        signedTimestamp: null,
        submittedTimestamp: null,
        to: transactionRequest.to,
        transactionHash: null,
        transactionStatus: 'created',
        type: transactionRequest.type,
        userId: config().userUuid, // This is just a fixed ID to keep things simple
        value: transactionRequest.value,
      })
    })
  })

  describe('updateTransaction', () => {
    it('should throw an exception if the transaction does not exist', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'signed',
      }

      transactionService.getTransaction.mockResolvedValueOnce(null)

      await expect(controller.updateTransaction(id, req)).rejects.toThrowError(
        'No such transaction',
      )
    })

    it('should fail to sign a transaction if it is already signed', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'signed',
      }

      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'signed',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await expect(controller.updateTransaction(id, req)).rejects.toThrowError(
        'Transaction already signed! Current status: signed',
      )
    })

    it('should sign a transaction', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'signed',
      }
      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'created',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await controller.updateTransaction(id, req)

      expect(transactionService.signTransaction).toBeCalledWith(mockTransaction)
    })

    it('should fail to submit a transaction if it not signed', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'submitted',
      }
      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'created',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await expect(controller.updateTransaction(id, req)).rejects.toThrowError(
        `Transaction must be signed first: current status ${mockTransaction.transactionStatus}`,
      )
    })

    it('should submit a transaction', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'submitted',
      }
      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'signed',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await controller.updateTransaction(id, req)

      expect(transactionService.submitTransaction).toBeCalledWith(
        mockTransaction,
      )
    })

    it('should abort a transaction', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'aborted',
      }
      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'signed',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await controller.updateTransaction(id, req)

      expect(transactionService.abortTransaction).toBeCalledWith(
        mockTransaction,
      )
    })

    it('should throw an error if an invalid status is requested', async () => {
      const id = '123'
      const req: TransactionStatusUpdateRequest = {
        transactionStatus: 'chocolate',
      }
      const mockTransaction = {
        ...mockTransactionTemplate,
        transactionStatus: 'created',
      }

      transactionService.getTransaction.mockResolvedValueOnce(mockTransaction)

      await expect(controller.updateTransaction(id, req)).rejects.toThrowError(
        `Invalid status ${req.transactionStatus}`,
      )
    })
  })

  describe('deleteAllTransactions', () => {
    it('should delete all transactions', async () => {
      await controller.deleteAllTransactions()
      expect(transactionService.deleteAllTransactions).toHaveBeenCalled()
    })
  })

  describe('getAllTransactions',  () => {
    it('gets transactions, filtered by status', async () => {

      const mockResult = []
      transactionService.getTransactions.mockResolvedValueOnce(mockResult)

      const result = await controller.getTransactions('created')
      expect(transactionService.getTransactions).toHaveBeenCalledWith('created')
  
      expect(result).toEqual(mockResult)
    })

  })

  describe('getTransaction',  () => {
    it('gets a single transaction by id', async () => {

      const mockResult = null; // Doesn't matter
      transactionService.getTransaction.mockResolvedValueOnce(mockResult)

      const result = await controller.getTransaction('123')
      expect(transactionService.getTransaction).toHaveBeenCalledWith('123')
  
      expect(result).toEqual(mockResult)
    })

  })
})
