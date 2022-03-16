import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'
import { EthereumTransaction } from '../data/entities/EthereumTransaction'

@Injectable()
export class EventService {
  private observable: Subject<any>

  constructor() {
    this.observable = new Subject<MessageEvent<EthereumTransaction>>()
  }

  async emitTransaction(transaction: EthereumTransaction): Promise<void> {
    this.observable.next({
      data: transaction,
      type: 'transaction',
    })
  }

  getObservable() {
    return this.observable
  }
}
