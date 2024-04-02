import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class DeleteDto extends PickType(SignUpDto, ['password'] as const) {}