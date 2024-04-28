import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/user.entity';
import { MembersRoleStrategy } from 'src/group-members/strategies/members.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Groups, GroupMembers, Users]), GroupMembersModule, UsersModule],
  controllers: [GroupsController],
  providers: [GroupsService, MembersRoleStrategy],
  exports : [GroupsService]
})
export class GroupsModule {}
