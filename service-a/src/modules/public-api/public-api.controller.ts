// service-a/src/modules/public-api/public-api.controller.ts
import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PublicApiService } from './public-api.service';
import { SearchDto } from './dto/search.dto';

@ApiTags('Public API')
@Controller('public-api')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({ summary: 'Search breweries via external API and store result' })
  @ApiQuery({ name: 'query', required: true, description: 'Search text' })
  @Get('search-and-store')
  async searchAndStore(@Query('query') query: string) {
    return this.publicApiService.searchAndStore(query);
  }

  @ApiOperation({ summary: 'Search stored breweries data with pagination' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('search')
  async searchStored(@Query() queryDto: SearchDto) {
    const { query, page, limit } = queryDto;
    return this.publicApiService.searchStored(query, page, limit);
  }

  @ApiOperation({ summary: 'Query Redis TimeSeries logs' })
  @ApiQuery({ name: 'from', required: true, type: Number, description: 'Start timestamp' })
  @ApiQuery({ name: 'to', required: true, type: Number, description: 'End timestamp' })
  @Get('timeseries')
  async queryTimeSeries(@Query('from') from: number, @Query('to') to: number) {
    return this.publicApiService.queryTimeSeries(from, to);
  }
}
