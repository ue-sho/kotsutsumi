import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get statistics summary' })
  @ApiResponse({ status: 200, description: 'Summary retrieved successfully' })
  async getSummary(@CurrentUser() user: CurrentUserPayload) {
    return this.statisticsService.getSummary(user.id);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get trends data' })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'year'], required: false })
  @ApiResponse({ status: 200, description: 'Trends data retrieved successfully' })
  async getTrends(
    @CurrentUser() user: CurrentUserPayload,
    @Query('period') period?: 'week' | 'month' | 'year',
  ) {
    return this.statisticsService.getTrends(user.id, period);
  }

  @Get('heatmap/:year')
  @ApiOperation({ summary: 'Get heatmap data for a year' })
  @ApiResponse({ status: 200, description: 'Heatmap data retrieved successfully' })
  async getHeatmap(
    @CurrentUser() user: CurrentUserPayload,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.statisticsService.getHeatmap(user.id, year);
  }
}
