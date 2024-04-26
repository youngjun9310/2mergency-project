import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePositionDto {

    @ApiProperty({
        example: '23.234421',
        description: 'start x location',
        required: false,
      })
    @IsNotEmpty({ message : "현재위치 x값을 작성해주세요." })
    startx : number;

    @ApiProperty({
        example: '127.234421',
        description: 'start y location',
        required: false,
      })
    @IsNotEmpty({ message : "현재위치 y값을 작성해주세요." })
    starty : number;

    @ApiProperty({
        example: '23.234421',
        description: 'end x location',
        required: false,
      })
    @IsNotEmpty({ message : "도착위치 x값을 작성해주세요." })
    endx : number;

    @ApiProperty({
        example: '127.234421',
        description: 'end y location',
        required: false,
      })
    @IsNotEmpty({ message : "도착위치 y값을 작성해주세요." })
    endy : number;

}
