import { ApiProperty } from '@nestjs/swagger' ;
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'abcd123@gmail.com',
    description: '이메일'
  })
  @IsNotEmpty({message: '이메일을 입력해주세요.'})
  email: string;


}