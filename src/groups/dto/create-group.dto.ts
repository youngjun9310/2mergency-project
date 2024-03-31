import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Category } from "../../types/Category.type";

export class CreateGroupDto {

    @IsString()
    @IsNotEmpty({ message : "제목을 기입해주세요." })
    title : string

    @IsString()
    @IsNotEmpty({ message : "내용을 기입해주세요." })
    content : string
    
    @IsEnum(Category)
    category : Category
    
}
