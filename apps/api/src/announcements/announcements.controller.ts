import { Controller, Get, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('announcements')
@Controller('announcements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published announcements' })
  @ApiResponse({ status: 200, description: 'Announcements retrieved successfully' })
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.announcementsService.findAllPublished(user.id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark an announcement as read' })
  @ApiResponse({ status: 200, description: 'Announcement marked as read' })
  async markAsRead(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.announcementsService.markAsRead(user.id, id);
  }
}
