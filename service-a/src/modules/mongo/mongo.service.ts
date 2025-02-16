// service-a/src/modules/mongo/mongo.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection, Document } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client!: MongoClient;
  private db!: Db;

  async onModuleInit(): Promise<void> {
    const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/serviceA';
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();

    // Create a text index on the "name" field and an index on "brewery_type"
    const collection = this.getCollection('breweries');
    await collection.createIndex({ name: 'text', brewery_type: 1 });
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
