import { PickType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../types/Category.type';

export class UpdateGroupDto extends PickType(CreateGroupDto, [
  'title',
  'content',
  'category',
]) {
  @ApiProperty({
    example: '그룹 제목',
    description: 'grouptitle',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '제목을 기입해주세요.' })
  title: string;

  @ApiProperty({
    example: '그룹 내용',
    description: 'groupcontent',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '내용을 기입해주세요.' })
  content: string;

  @ApiProperty({
    example: 'hiking',
    description: 'groupcategory',
    required: true,
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    example: false,
    description: 'groupisPublic',
    required: false,
  })
  @IsOptional()
  isPublic?: string;
}
