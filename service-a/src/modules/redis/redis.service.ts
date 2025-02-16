// service-a/src/modules/redis/redis.service.ts

import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { EventTypes } from '../public-api/public-api.service';

@Injectable()
export class RedisService {
  public client: RedisClientType;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  // Map event type to the corresponding Redis TimeSeries key
  private getTimeSeriesKey(eventType: EventTypes): string {
    switch (eventType) {
      case EventTypes.SEARCH_AND_STORE:
        return 'api:searchAndStore';
      // If more event types require different keys, add cases here.
      default:
        throw new Error(`Unsupported event type: ${eventType}`);
    }
  }

  async addTimeSeries(
    eventType: EventTypes,
    timestamp: number | '*',
    value: number
  ): Promise<string> {
    const key = this.getTimeSeriesKey(eventType);
    return this.client.sendCommand([
      'TS.ADD',
      key,
      timestamp.toString(),
      value.toString()
    ]);
  }

  async queryTimeSeries(
    eventType: EventTypes,
    from: number,
    to: number
  ): Promise<string> {
    const key = this.getTimeSeriesKey(eventType);
    return this.client.sendCommand([
      'TS.RANGE',
      key,
      from.toString(),
      to.toString()
    ]);
  }
}
