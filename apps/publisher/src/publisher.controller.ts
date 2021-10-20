import { Controller, Get } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller()
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('/publish')
  publish() {
    return this.publisherService.publish();
  }

  @Get('/publish/rpc')
  publishRPC() {
    return this.publisherService.publishRPC();
  }
}
