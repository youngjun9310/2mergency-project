import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePositionDto {

    @ApiProperty({
        example: '23.234421',
        description: 'start x location',
        required: false,
      })
    @IsOptional()
    startx? : number;

    @ApiProperty({
        example: '127.234421',
        description: 'start y location',
        required: false,
      })
    @IsOptional()
    starty? : number;

    @ApiProperty({
        example: '23.234421',
        description: 'end x location',
        required: false,
      })
    @IsOptional()
    endx? : number;

    @ApiProperty({
        example: '127.234421',
        description: 'end y location',
        required: false,
      })
    @IsOptional()
    endy? : number;

    @ApiProperty({
        example: '23.234421',
        description: 'x present location',
        required: true,
      })
    @IsNotEmpty({ message : "현재위치 x값을 작성해주세요." })
    latitude : number;

    @ApiProperty({
        example: '127.234421',
        description: 'y present location',
        required: true,
      })
    @IsNotEmpty({ message : "현재위치 y값을 작성해주세요." })
    longitude : number;

}
