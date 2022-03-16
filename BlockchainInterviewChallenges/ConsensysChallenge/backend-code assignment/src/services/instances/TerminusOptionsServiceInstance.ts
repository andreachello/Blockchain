import { Injectable } from '@nestjs/common'
import { TerminusOptionsService } from '../TerminusOptionsService'

@Injectable()
export class TerminusOptionsServiceInstance {
  private terminusOptionsService

  constructor() {
    this.terminusOptionsService = TerminusOptionsService
  }

  instance() {
    return this.terminusOptionsService
  }
}
