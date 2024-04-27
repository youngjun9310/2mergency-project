import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../../types/Category.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    example: '여행 사랑 그룹',
    description: '그룹의 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '제목을 기입해주세요.' })
  title: string;

  @ApiProperty({
    example: '이 그룹은 여행을 좋아하는 사람들의 모임입니다.',
    description: '그룹의 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '내용을 기입해주세요.' })
  content: string;

  @ApiProperty({
    example: Category.Walking,
    description: '그룹의 카테고리',
    enum: Object.keys(Category),
    required: true,
  })
  @IsEnum(Category, { message: '유효한 카테고리를 선택해주세요.' })
  category: Category;
}
