import { Test } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { Category } from 'src/types/Category.type';
// 가짜 스케쥴 서비스를 만듦
const mockSchedulesService = {
  createSchedule: jest.fn(),
  getAllSchedule: jest.fn(),
  getOneSchedule: jest.fn(),
  changeSchedule: jest.fn(),
  deleteSchedule: jest.fn(),
};

// 테스트 스위트 생성(테스트 블록들을 품을 친구임.)
// 테스트할 대상은 schedulesService
describe('schedulesService', () => {
  let schedulesService: SchedulesService;

  // 테스팅 모듈 생성
  // Testing 모듈을 만들기 위한 메서드는 Test클래스가 제공을 해줌
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: SchedulesService, useValue: mockSchedulesService }],
    }).compile();

    schedulesService = moduleRef.get<SchedulesService>(SchedulesService);
    schedule = {
      title: '제목임',
      content: '내용임',
      category: Category.hiking,
      scheduleDate: new Date('2024-05-05'),
      groupId: 1,
      userId: 1,
    };
  });

  it('createSchedule', async () => {
    mockSchedulesService.createSchedule.mockImplementation(() => schedule);
    const { title, ...expectedValue } = schedule;
  });
});
