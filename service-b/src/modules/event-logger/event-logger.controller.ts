// service-b/src/modules/event-logger/event-logger.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { EventLoggerService } from './event-logger.service';
import { EventLog } from './event-logger.service';

@ApiTags('Event Logger')
@Controller('events')
export class EventLoggerController {
  constructor(private readonly eventLoggerService: EventLoggerService) {}

  @ApiOperation({ summary: 'Get all event logs by date range' })
  @ApiQuery({
    name: 'from',
    required: true,
    type: String,
    description: 'Start date in YYYY-MM-DD format'
  })
  @ApiQuery({
    name: 'to',
    required: true,
    type: String,
    description: 'End date in YYYY-MM-DD format'
  })
  @Get()
  async getEvents(
    @Query('from') from: string,
    @Query('to') to: string
  ): Promise<EventLog[]> {
    const fromDate = new Date(`${from}T00:00:00Z`);
    const toDate = new Date(`${to}T23:59:59Z`);

    const events = await this.eventLoggerService.getEventsByDateRange(
      fromDate,
      toDate
    );
    return events;
  }
}
