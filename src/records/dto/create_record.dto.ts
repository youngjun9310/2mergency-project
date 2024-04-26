import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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
}
