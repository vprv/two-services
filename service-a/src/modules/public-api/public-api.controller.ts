// service-a/src/modules/public-api/public-api.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PublicApiService } from './public-api.service';

@ApiTags('Public API')
@Controller('public-api')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({
    summary: 'Search breweries via external API and store result'
  })
  @ApiQuery({ name: 'query', required: true, description: 'Search text' })
  @Get('search-and-store')
  async searchAndStore(@Query('query') query: string) {
    return this.publicApiService.searchAndStore(query);
  }

  @ApiOperation({ summary: 'Search stored breweries data with pagination' })
  @ApiQuery({ name: 'query', required: false, description: 'Search text' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default 1)'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default 10)'
  })
  @Get('search')
  async searchStored(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.publicApiService.searchStored(
      query,
      Number(page),
      Number(limit)
    );
  }

  @ApiOperation({ summary: 'Query Redis TimeSeries logs' })
  @ApiQuery({
    name: 'from',
    required: true,
    type: Number,
    description: 'Start timestamp'
  })
  @ApiQuery({
    name: 'to',
    required: true,
    type: Number,
    description: 'End timestamp'
  })
  @Get('timeseries')
  async queryTimeSeries(@Query('from') from: number, @Query('to') to: number) {
    return this.publicApiService.queryTimeSeries(from, to);
  }
}
