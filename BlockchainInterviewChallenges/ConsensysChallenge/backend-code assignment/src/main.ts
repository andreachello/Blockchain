import { startServer } from './server'

import { Logger } from '@nestjs/common'

const logger = new Logger('main')

startServer().catch((e) => {
  logger.error(`Failed to start NestJS server: ${e.message}`)
})
