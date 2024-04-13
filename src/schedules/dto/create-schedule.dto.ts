import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/types/Category.type';

export class ScheduleDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @IsEnum(Category)
  @IsNotEmpty({ message: '카테고리를 선택해주세요.' })
  category: Category;

  @IsNotEmpty({ message: '일정 날짜를 선택해주세요.' })
  scheduleDate: Date;
}
