import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { Category } from 'src/types/Category.type';

export class ScheduleDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @ApiProperty({
    description: '일정의 제목',
    example: '일정 제목',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @ApiProperty({
    description: '일정의 상세 내용',
    example: '일정 상세 계획',
    required: true,
  })
  content: string;

  @IsEnum(Category, { message: '카테고리를 선택해주세요.' })
  @ApiProperty({
    description: '일정의 카테고리',
    enum: Category,
    example: Category.hiking,
    required: true,
  })
  category: Category;

  @IsNotEmpty({ message: '일정 날짜를 선택해주세요.' })
  @ApiProperty({
    description: '일정 날짜',
    example: '2024-12-25',
    required: true,
  })
  scheduleDate: Date;
}
