import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateScheduleMemberDto {
  @IsNotEmpty()
  @IsInt()
  scheduleId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
