import { PickType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGroupDto extends PickType(CreateGroupDto, ['title', 'content', 'category']) {
    @IsOptional()
    @IsBoolean()
    isPublic? : boolean
}
