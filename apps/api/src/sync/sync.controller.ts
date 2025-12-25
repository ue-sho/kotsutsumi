import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncUploadDto } from './dto/sync-upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('sync')
@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload local work logs to cloud' })
  @ApiResponse({ status: 201, description: 'Work logs synced successfully' })
  async upload(
    @CurrentUser() user: CurrentUserPayload,
    @Body() syncUploadDto: SyncUploadDto,
  ) {
    return this.syncService.upload(user.id, syncUploadDto);
  }

  @Get('download')
  @ApiOperation({ summary: 'Download work logs from cloud' })
  @ApiQuery({ name: 'lastSyncAt', required: false })
  @ApiResponse({ status: 200, description: 'Work logs downloaded successfully' })
  async download(
    @CurrentUser() user: CurrentUserPayload,
    @Query('lastSyncAt') lastSyncAt?: string,
  ) {
    return this.syncService.download(user.id, lastSyncAt);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get sync status' })
  @ApiResponse({ status: 200, description: 'Sync status retrieved successfully' })
  async getStatus(@CurrentUser() user: CurrentUserPayload) {
    return this.syncService.getStatus(user.id);
  }

  @Post('devices/register')
  @ApiOperation({ summary: 'Register a device' })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  async registerDevice(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { deviceName?: string; deviceType?: string },
  ) {
    return this.syncService.registerDevice(user.id, body.deviceName, body.deviceType);
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully' })
  async getDevices(@CurrentUser() user: CurrentUserPayload) {
    return this.syncService.getDevices(user.id);
  }
}
