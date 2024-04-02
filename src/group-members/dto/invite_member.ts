import { IsNotEmpty, IsString } from "class-validator";

export class InvitememberDto {
    
    @IsString()
    @IsNotEmpty({ message : "이메일이 존재하지 않습니다." })
    email : string

}
