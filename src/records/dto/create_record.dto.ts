import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRecordDto {

    @ApiProperty({
        example: '5000',
        description: 'exercise record',
        required: true,
      })
    @IsNotEmpty({ message : "데이터를 기록해주세요." })
    stackedDistance : bigint;
}
