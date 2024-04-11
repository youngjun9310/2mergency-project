import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleMemberDto } from './create-schedule-member.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateScheduleMemberDto extends PartialType(CreateScheduleMemberDto) {
      
  @IsNotEmpty()
  @IsInt()
  scheduleId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
