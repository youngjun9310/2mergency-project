import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}
