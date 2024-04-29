import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRecordDto {

    @ApiProperty({
        example: '10:00',
        description: 'starttime record',
        required: true,
      })
    @IsString()
    startTime : Date;

    @ApiProperty({
      example: '15:00',
      description: 'endtime record',
      required: true,
      })
    @IsString()
    endTime : Date;
  
    @ApiProperty({
        example: '5000',
        description: 'exercise record',
        required: true,
      })
    @IsNotEmpty({ message : "데이터를 기록해주세요." })
    stackedDistance : bigint;

    @ApiProperty({
      example: '23.234421',
      description: 'start x location',
      required: false,
    })
  @IsOptional()
  startx : number;

  @ApiProperty({
      example: '127.234421',
      description: 'start y location',
      required: false,
    })
  @IsOptional()
  starty : number;

  @ApiProperty({
      example: '23.234421',
      description: 'end x location',
      required: false,
    })
  @IsOptional()
  endx : number;

  @ApiProperty({
      example: '127.234421',
      description: 'end y location',
      required: false,
    })
  @IsOptional()
  endy : number;
  
}
