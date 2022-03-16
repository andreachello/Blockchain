import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Other')
@Controller()
export class HealthCheckController {
  @Get()
  health(): string {
    return 'OK'
  }
}
