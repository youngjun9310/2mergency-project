import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleMemberDto } from './create-schedule-member.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleMemberDto extends PartialType(CreateScheduleMemberDto) {
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
