import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { GroupMembersModule } from 'src/group-members/group-members.module';


@Module({
  imports : [TypeOrmModule.forFeature([Groups, GroupMembers]), GroupMembersModule], //어느 레포지토리 쓸고닝~
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
