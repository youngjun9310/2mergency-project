import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {

    @IsString()
    @IsNotEmpty({ message : "닉네임을 기입해주세요." })
    nickname : string

    @IsString()
    @IsNotEmpty({ message : "이메일을 기입해주세요." })
    email : string

    @IsString()
    @IsNotEmpty({ message : "패스워드를 기입해주세요." })
    password : string

    @IsString()
    @IsNotEmpty({ message : "주소를 기입해주세요." })
    address : string

    @IsOptional()
    @IsString()
    profileImage? : string
    
}
