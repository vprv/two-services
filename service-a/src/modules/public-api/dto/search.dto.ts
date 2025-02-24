// service-a/src/modules/public-api/dto/search.dto.ts
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search text' })
  query?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  limit?: number = 10;
}
