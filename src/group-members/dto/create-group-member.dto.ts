import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '../types/groupMemberRole.type';

export class CreateGroupMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  @ApiProperty({
    description: '그룹 멤버의 이메일 주소',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @ApiProperty({
    description: '그룹 멤버의 별명',
    example: 'nickname',
    required: true,
  })
  nickname: string;

  @IsBoolean()
  @ApiProperty({
    description: '멤버의 유효성 확인 상태',
    example: true,
    required: true,
  })
  isValid: boolean; // 이름을 'isValid'로 변경했습니다.

  @IsBoolean()
  @ApiProperty({
    description: '멤버가 초대되었는지 여부',
    example: true,
    required: true,
  })
  isInvited: boolean;

  @IsEnum(MemberRole)
  @IsOptional()
  @ApiProperty({
    description: '그룹 멤버의 역할',
    enum: MemberRole,
    example: MemberRole.User,
    required: false,
    default: MemberRole.User,
  })
  role?: MemberRole = MemberRole.User;
}
