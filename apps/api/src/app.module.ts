import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkLogsModule } from './work-logs/work-logs.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SyncModule } from './sync/sync.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkLogsModule,
    CategoriesModule,
    TagsModule,
    StatisticsModule,
    SyncModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
