import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  DNSHealthIndicator,
  TerminusModuleOptions,
} from '@nestjs/terminus'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(private readonly dns: DNSHealthIndicator) {}
  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health',
      healthIndicators: [
        // We can set up Healthcheck indicators from the following list: https://docs.nestjs.com/recipes/terminus#setting-up-a-health-check
        // Choose one based on the downstream dependencies your app has.
        async () => this.dns.pingCheck('Google DNS up?', 'https://google.com'),
      ],
    }
    return {
      endpoints: [healthEndpoint],
    }
  }
}
