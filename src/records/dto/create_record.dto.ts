import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRecordDto {

    @ApiProperty({
        example: '10:00',
        description: 'starttime record',
        required: true,
      })
    @IsNotEmpty({ message : "시작 시간을 기록해주세요." })
    startTime : Date;

    @ApiProperty({
      example: '15:00',
      description: 'endtime record',
      required: true,
      })
    @IsNotEmpty({ message : "도착 시간을 기록해주세요." })
    endTime : Date;
  
    @ApiProperty({
        example: '5000',
        description: 'exercise record',
        required: true,
      })
    @IsNotEmpty({ message : "데이터를 기록해주세요." })
    stackedDistance : bigint;
}
