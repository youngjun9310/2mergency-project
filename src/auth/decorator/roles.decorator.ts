import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/group-members/types/groupMemberRole.type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);