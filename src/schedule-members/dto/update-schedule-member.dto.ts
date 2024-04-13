import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleMemberDto } from './create-schedule-member.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateScheduleMemberDto extends PartialType(
  CreateScheduleMemberDto,
) {
  // @IsString()
  // @IsNotEmpty()
  // nickname: string;
}
