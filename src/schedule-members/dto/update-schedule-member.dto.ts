import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleMemberDto } from './create-schedule-member.dto';

export class UpdateScheduleMemberDto extends PartialType(CreateScheduleMemberDto) {}
