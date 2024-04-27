import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'abcd123@gmail.com',
    description: '사용자의 이메일 주소입니다.',
  })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    description: '패스워드',
  })
  @IsNotEmpty({ message: '패스워드를 입력해주세요.' })
  password: string;
}
