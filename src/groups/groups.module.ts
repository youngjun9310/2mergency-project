import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Groups])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
