import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { RoleStrategy } from 'src/auth/strategy/roles.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groups, GroupMembers]),
    GroupMembersModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, RoleStrategy],
})
export class GroupsModule {}
