import { SetMetadata } from '@nestjs/common';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';

export const MemberRoles = (...memberRoles: MemberRole[]) => SetMetadata('memberRoles', memberRoles);