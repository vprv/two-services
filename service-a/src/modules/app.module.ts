// service-a/src/modules/app.module.ts
import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api/public-api.controller';
import { PublicApiService } from './public-api/public-api.service';
import { MongoService } from './mongo/mongo.service';
import { RedisService } from './redis/redis.service';
import { MessagingService } from './messaging/messaging.service';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [PublicApiController],
  providers: [PublicApiService, MongoService, RedisService, MessagingService]
})
export class AppModule {}
