import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { Position } from './entities/position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Position, Users]), UsersModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
