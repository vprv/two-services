// service-b/src/app.module.ts
import { Module } from '@nestjs/common';
import { EventLoggerController } from './modules/event-logger/event-logger.controller';
import { EventLoggerService } from './modules/event-logger/event-logger.service';
import { MessagingService } from './modules/messaging/messaging.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [EventLoggerController],
  providers: [EventLoggerService, MessagingService]
})
export class AppModule {}
