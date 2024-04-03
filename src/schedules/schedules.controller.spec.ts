import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

describe('SchedulesController', () => {
  let schedulesController: SchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [SchedulesService],
    }).compile();

    schedulesController = module.get<SchedulesController>(SchedulesController);
  });

  it('하이킹 스케쥴 생성', () => {
    const
    expect(schedulesController).toBeDefined();
  });
});
