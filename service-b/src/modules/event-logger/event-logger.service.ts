// service-b/src/modules/event-logger/event-logger.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection, Document } from 'mongodb';

// Interface for event logs; structure should match the events published by Service A
export interface EventLog extends Document {
  type: string;
  query: string;
  resultCount?: number;
  page?: number;
  limit?: number;
  timestamp: string;
  duration?: number;
}

@Injectable()
export class EventLoggerService implements OnModuleInit, OnModuleDestroy {
  private client!: MongoClient;
  private db!: Db;

  async onModuleInit(): Promise<void> {
    const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/serviceB';
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();

    const collection = this.getCollection<EventLog>('event_logs');
    await collection.createIndex({ timestamp: 1 });
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async logEvent(event: EventLog): Promise<void> {
    const collection = this.getCollection<EventLog>('event_logs');
    await collection.insertOne(event);
  }

  async getEventsByDateRange(from: Date, to: Date): Promise<EventLog[]> {
    const collection = this.getCollection<EventLog>('event_logs');
    return collection
      .find({
        timestamp: {
          $gte: from.toISOString(),
          $lte: to.toISOString()
        }
      })
      .toArray();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
