import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMembersController } from './schedule-members.controller';
import { ScheduleMembersService } from './schedule-members.service';

describe('ScheduleMembersController', () => {
  let controller: ScheduleMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleMembersController],
      providers: [ScheduleMembersService],
    }).compile();

    controller = module.get<ScheduleMembersController>(ScheduleMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
