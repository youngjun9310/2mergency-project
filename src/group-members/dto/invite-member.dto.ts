import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  @ApiProperty({
    description: '그룹 멤버의 이메일 주소',
    example: 'user@example.com',
    required: true,
  })
  email: string;
}
