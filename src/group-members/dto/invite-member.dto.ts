import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}
