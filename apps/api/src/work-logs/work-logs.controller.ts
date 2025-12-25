import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('work-logs')
@Controller('work_logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkLogsController {
  constructor(private workLogsService: WorkLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work log' })
  @ApiResponse({ status: 201, description: 'Work log created successfully' })
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createWorkLogDto: CreateWorkLogDto,
  ) {
    return this.workLogsService.create(user.id, createWorkLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work logs with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Work logs retrieved successfully' })
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: WorkLogQueryDto) {
    return this.workLogsService.findAll(user.id, query);
  }

  @Get('calendar/:year/:month')
  @ApiOperation({ summary: 'Get work logs for calendar view' })
  @ApiResponse({ status: 200, description: 'Calendar data retrieved successfully' })
  async findByCalendar(
    @CurrentUser() user: CurrentUserPayload,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.workLogsService.findByCalendar(user.id, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a work log by id' })
  @ApiResponse({ status: 200, description: 'Work log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  async findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workLogsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a work log' })
  @ApiResponse({ status: 200, description: 'Work log updated successfully' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkLogDto: UpdateWorkLogDto,
  ) {
    return this.workLogsService.update(id, user.id, updateWorkLogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work log' })
  @ApiResponse({ status: 200, description: 'Work log deleted successfully' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workLogsService.remove(id, user.id);
  }
}
