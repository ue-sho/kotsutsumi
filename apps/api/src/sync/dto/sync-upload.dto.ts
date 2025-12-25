import { IsString, IsOptional, IsDateString, IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocalWorkLogDto {
  @ApiProperty({ example: 'uuid-v4-string' })
  @IsString()
  localId: string;

  @ApiProperty({ example: '作業タイトル' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '作業の詳細内容' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  workDate: string;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(0)
  durationMinutes: number;

  @ApiProperty({ example: 'in_progress' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;
}

export class SyncUploadDto {
  @ApiProperty({ type: [LocalWorkLogDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalWorkLogDto)
  workLogs: LocalWorkLogDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  deviceId?: number;
}
