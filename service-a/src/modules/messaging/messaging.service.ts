// service-a/src/modules/messaging/messaging.service.ts

import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { EventPayload, EventTypes } from '../public-api/public-api.service';

@Injectable()
export class MessagingService {
  private readonly channel = 'service_events';

  constructor(private readonly redisService: RedisService) {}

  async publishEvent(event: EventPayload): Promise<void> {
    const message = JSON.stringify(event);
    await this.redisService.client.publish(this.channel, message);
  }
}
