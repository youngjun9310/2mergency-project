import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsBoolean()
  @IsNotEmpty()
  isVailed: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isInvited: boolean;
}
