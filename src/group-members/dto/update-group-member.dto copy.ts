import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  @ApiProperty({
    description: '초대할 사용자의 이메일 주소',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '초대할 사용자의 별명',
    example: 'nickname',
    required: true,
  })
  nickname: string;
}
