import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @MaxLength(100)
  name: string;
}
