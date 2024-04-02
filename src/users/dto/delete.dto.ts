import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class DeleteDto {
  @IsString()
  @ApiProperty({
    example: '123456',
    description: '비밀번호',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

 
}