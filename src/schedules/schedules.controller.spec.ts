import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/schedule.dto';
import { Category } from 'src/types/Category.type';
import { Users } from 'src/users/entities/user.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { Schedules } from './entities/schedule.entity';

describe('schedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        {
          provide: SchedulesService,
          useValue: {
            createSchedule: jest.fn(),
            getAllSchedule: jest.fn(),
            getOneSchedule: jest.fn(),
            changeSchedule: jest.fn(),
            deleteSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
  });

  const dto = new ScheduleDto();
  dto.title = '새로운 스케쥴';
  dto.content = '새로운 스케쥴 내용';
  dto.scheduleDate = new Date('2024-05-11'); // 이거 어떻게 하라는거임
  dto.category = Category.hiking;

  const user = new Users();
  user.userId = 1;
  user.email = 'aaa1@naver.com';
  user.nickname = '닉네임';
  user.password = 'aaa1';

  const group = new Groups();
  group.groupId = 1;
  group.title = '그룹 1';
  group.content = '그룹 1 내용';
  group.category = Category.hiking;

  const schedule = new Schedules();
  schedule.scheduleId = 1;
  schedule.title = dto.title;
  schedule.content = dto.content;
  schedule.category = dto.category;
  schedule.scheduleDate = new Date('2024-05-11');
  schedule.createdAt = new Date();
  schedule.updatedAt = new Date();
  //   schedule.groupId = group.groupId
  //   schedule.userId = user.userId
  //   schedule.scheduleMembers =

  // 스케쥴 생성 테스트

  describe('createSchedule', () => {
    it('스케쥴 생성', async () => {
      const dto = new ScheduleDto();
      dto.title = '새로운 스케쥴';
      dto.content = '새로운 스케쥴 내용';
      dto.category = Category.hiking;

      const mockGrop = { ...group };
      const mockUser = { ...user };

      const schedule: Partial<Schedules> = {
        scheduleId: 1,
        title: dto.title,
        content: dto.content,
        category: dto.category,
        scheduleDate: new Date('2024-05-11'),
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: mockGrop.groupId,
        userId: mockUser.userId,
        scheduleMembers: [],
      };

      jest.spyOn(service, 'createSchedule').mockResolvedValue({ statusCode: 200, message: '스케쥴 생성 성공' });

      expect(await controller.createSchedule(dto, user, group.groupId)).toBe(schedule);
    });
  });

  // 스케쥴 전체 조회 테스트
  describe('getAllSchedules', () => {
    it('스케쥴 전체 조회', async () => {});
  });
});
