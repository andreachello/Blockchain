export class TransactionRequest {
  to: string
  accountId: string
  gasLimit: string
  gasPrice?: string
  maxPriorityFeePerGas?: string
  maxFeePerGas?: string
  data: string
  value: string
  type: string
}
