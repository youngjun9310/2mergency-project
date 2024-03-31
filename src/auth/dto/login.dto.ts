import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsString()
    @IsNotEmpty({ message : "이메일을 기입해주세요." })
    email : string

    @IsString()
    @IsNotEmpty({ message : "패스워드를 기입해주세요." })
    password : string
    
}
