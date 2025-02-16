// service-a/src/modules/public-api/public-api.service.ts

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { MongoService } from '../mongo/mongo.service';
import { MessagingService } from '../messaging/messaging.service';
import { RedisService } from '../redis/redis.service';

// Interface representing a brewery returned from the public API
export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  street?: string;
  address_2?: string;
  address_3?: string;
  city?: string;
  state?: string;
  county_province?: string;
  postal_code?: string;
  country?: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  website_url?: string;
  updated_at?: string;
  created_at?: string;
}

// Enum for collection names
export enum CollectionNames {
  BREWERIES = 'breweries'
}

// Enum for event types
export enum EventTypes {
  SEARCH_AND_STORE = 'searchAndStore',
  SEARCH_STORED = 'searchStored'
}

// Interface for event payloads
export interface EventPayload {
  type: EventTypes;
  query: string;
  resultCount?: number;
  page?: number;
  limit?: number;
  timestamp: string;
  duration?: number;
}

@Injectable()
export class PublicApiService {
  private readonly logger = new Logger(PublicApiService.name);
  private readonly breweryApiUrl = 'https://api.openbrewerydb.org/breweries';

  constructor(
    private readonly mongoService: MongoService,
    private readonly messagingService: MessagingService,
    private readonly redisService: RedisService
  ) {}

  async searchAndStore(query: string): Promise<{
    success: boolean;
    data?: Brewery[];
    duration?: number;
    message?: string;
  }> {
    const start = Date.now();

    // Request to the public API by brewery name
    const response = await axios.get<Brewery[]>(this.breweryApiUrl, {
      params: { by_name: query }
    });
    const data = response.data;

    // If no data is returned, respond accordingly
    if (!data || data.length === 0) {
      return { success: false, message: 'No results found from API' };
    }

    // Save the received data into the BREWERIES collection
    const collection = this.mongoService.getCollection<Brewery>(
      CollectionNames.BREWERIES
    );
    await collection.insertMany(data, { ordered: false });

    const duration = Date.now() - start;

    // Log API execution time in Redis TimeSeries using the event type as key
    await this.redisService.addTimeSeries(
      EventTypes.SEARCH_AND_STORE,
      '*',
      duration
    );

    // Publish an event for the searchAndStore operation
    const event: EventPayload = {
      type: EventTypes.SEARCH_AND_STORE,
      query,
      resultCount: data.length,
      timestamp: new Date().toISOString(),
      duration
    };
    await this.messagingService.publishEvent(event);

    this.logger.log(`Search and store executed in ${duration}ms`);
    return { success: true, data, duration };
  }

  async searchStored(
    query: string = '',
    page: number = 1,
    limit: number = 10
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: Brewery[];
  }> {
    const collection = this.mongoService.getCollection<Brewery>(
      CollectionNames.BREWERIES
    );

    // If query is empty, use an empty filter (i.e., return all documents)
    const filter = query ? { $text: { $search: query } } : {};

    const skip = (page - 1) * limit;
    const data = await collection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await collection.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Publish an event for the searchStored operation
    const event: EventPayload = {
      type: EventTypes.SEARCH_STORED,
      query,
      page,
      limit,
      resultCount: data.length,
      timestamp: new Date().toISOString()
    };
    await this.messagingService.publishEvent(event);

    return { total, page, limit, totalPages, data };
  }

  async queryTimeSeries(from: number, to: number): Promise<{ result: string }> {
    const result = await this.redisService.queryTimeSeries(
      EventTypes.SEARCH_AND_STORE,
      from,
      to
    );
    return { result };
  }
}
