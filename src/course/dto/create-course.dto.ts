import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LevelEnum } from '../enums/level.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(LevelEnum)
  level: LevelEnum;
}
