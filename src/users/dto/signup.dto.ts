import { ApiProperty } from '@nestjs/swagger' ;
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsString()
  @ApiProperty({
    example: 'nickname',
    description: '닉네임'
  })
  @IsNotEmpty({message: '닉네임을 입력해주세요.'})
  nickname: string;

  @IsEmail()
  @ApiProperty({
    example: 'abcd123@gmail.com',
    description: '이메일'
  })
  @IsNotEmpty({message: '이메일을 입력해주세요.'})
  email: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    description: '패스워드'
  })
  @IsNotEmpty({message: '패스워드를 입력해주세요.'})
  password: string;

  @IsString()
  @ApiProperty({
    example: 'passwordConfirm',
    description: '비밀번호 재확인',
  })
  @IsNotEmpty({ message: '비밀번호 재확인을 입력해주세요.' })
  passwordConfirm: string;
  
  @IsString()
  @ApiProperty({
    example: 'adminPassword',
    description: '어드민 가입 패스워드',
  })
  @IsOptional()
  adminPassword: string;

  @IsString()
  @ApiProperty({
    example: '서울시',
    description: '주소'
  })
  @IsNotEmpty({message: '주소를 입력해주세요.'})
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: true,
    description: '공개된 사용자여부'
  })
  isOpen: string;
   
}