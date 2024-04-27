import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Category } from "../../types/Category.type";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDto {

    @ApiProperty({
        example: '그룹 제목',
        description: 'grouptitle',
        required: true,
      })
    @IsString()
    @IsNotEmpty({ message : "제목을 기입해주세요." })
    title : string


    @ApiProperty({
        example: '그룹 내용',
        description: 'groupcontent',
        required: true,
      })
    @IsString()
    @IsNotEmpty({ message : "내용을 기입해주세요." })
    content : string
    

    @ApiProperty({
        example: 'walking',
        description: 'groupcategory',
        required: true,
      })
    @IsEnum(Category)
    category : Category
    
}
