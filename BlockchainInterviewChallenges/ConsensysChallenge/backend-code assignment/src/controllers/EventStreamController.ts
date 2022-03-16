import { Controller, Sse, MessageEvent } from '@nestjs/common'

import { Logger } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Observable } from 'rxjs'
import { EventService } from '../services/EventService'

require('dotenv').config()

export const VALID_HEALTHCHECK_MESSAGE = 'OK'

@ApiTags('Custodian')
@Controller('custodian')
export class EventStreamController {
  constructor(
    private readonly logger: Logger,
    private eventService: EventService,
  ) {}

  // https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
  @Sse('sse')
  @ApiOperation({ description: 'Obtain the event stream' })
  sse(): Observable<MessageEvent> {
    this.logger.log('Event stream connection')
    return this.eventService.getObservable()
  }
}
