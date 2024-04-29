import { SetMetadata } from '@nestjs/common';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';

// export const MemberRole_Key = 'memberRoles';
export const MemberRoles = (...memberRoles: MemberRole[]) =>
  SetMetadata('memberRoles', memberRoles);
