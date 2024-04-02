import { Module } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports : [TypeOrmModule.forFeature([Groups, GroupMembers]), MailModule],
  controllers: [GroupMembersController],
  providers: [GroupMembersService]
})
export class GroupMembersModule {}
