import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMembersService } from './schedule-members.service';

describe('ScheduleMembersService', () => {
  let service: ScheduleMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleMembersService],
    }).compile();

    service = module.get<ScheduleMembersService>(ScheduleMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
