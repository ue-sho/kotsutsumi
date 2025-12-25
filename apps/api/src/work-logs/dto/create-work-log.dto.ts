import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsEnum,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkLogStatus } from '@prisma/client';

export class CreateWorkLogDto {
  @ApiProperty({ example: '作業タイトル' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '作業の詳細内容（マークダウン対応）' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  workDate: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number;

  @ApiPropertyOptional({ enum: WorkLogStatus, default: 'in_progress' })
  @IsOptional()
  @IsEnum(WorkLogStatus)
  status?: WorkLogStatus;

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @ApiPropertyOptional({ example: 'uuid-from-client' })
  @IsOptional()
  @IsString()
  localId?: string;
}
