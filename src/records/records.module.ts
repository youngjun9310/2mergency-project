import { Module, forwardRef } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Records } from './entities/record.entity';
import { Users } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [ 
    TypeOrmModule.forFeature([Records, Users], 
    ) ,forwardRef (()=>UsersModule)    ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports : [RecordsService]
})

export class RecordsModule {}