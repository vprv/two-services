// service-b/src/modules/messaging/messaging.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { EventLoggerService } from '../event-logger/event-logger.service';
import { EventLog } from '../event-logger/event-logger.service';

@Injectable()
export class MessagingService implements OnModuleInit {
  private readonly channel = 'service_events';
  private subscriber: RedisClientType;

  constructor(private readonly eventLoggerService: EventLoggerService) {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    this.subscriber = createClient({ url: redisUrl });
    this.subscriber.on('error', (err) =>
      console.error('Redis Subscriber Error', err)
    );
  }

  async onModuleInit(): Promise<void> {
    await this.subscriber.connect();
    // Subscribe to the channel and process messages
    await this.subscriber.subscribe(this.channel, async (message) => {
      try {
        const event: EventLog = JSON.parse(message);
        await this.eventLoggerService.logEvent(event);
      } catch (err) {
        console.error('Error processing event:', err);
      }
    });
  }
}
