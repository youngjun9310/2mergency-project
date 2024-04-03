// import { Test } from '@nestjs/testing';
// import { SchedulesService } from './schedules.service';
// import { Repository } from 'typeorm';
// import { Schedules } from './entities/schedule.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Category } from 'src/types/Category.type';

// // 테스트 스위트와 테스트 케이스에서 사용하는 이름
// describe('SchedulesService', () => {
//   // 테스트 스위트에서 사용할 SchedulesService를 선언
//   let schedulesService: SchedulesService;
//   let schedulesServiceRepositoryMock: Partial<
//     Record<keyof Repository<Schedules>, jest.Mock>
//   >;

//   // 전체 스위트에서 실행 전에 계속 가져와야 하므로, beforeEach 사용
//   beforeEach(async () => {
//     schedulesServiceRepositoryMock = {
//     save: jest.fn(),
//     find:jest.fn(),
//     findOne: jest.fn(),
//     update: jest.fn(),
//     delete: jest.fn(),
//     }

//     // 테스트 모듈 생성
//     /** Test.createTestingModule의 리턴 값은 TestingModuleBuilder임. compile함수로 모듈 생성을 완료함(비동기) **/
//     const moduleRef = await Test.createTestingModule({
//       providers:[
//       SchedulesService,
//       {
//         provide: getRepositoryToken(Schedules),
//         useValue: schedulesServiceRepositoryMock
//       }
//       ]
//     }).compile();
//     // 프로바이더로 제공된 SchedulesServicd를 가져온다.
//     schedulesService = moduleRef.get<SchedulesService>(SchedulesService);
//     })
//   });

//   // 하이킹 스케쥴 등록(특정 시나리오를 작성하는 부분 it)
//   it('하이킹 스케쥴 등록', async () => {
//     const hikingSchedule = {title, content, category, scheduleDate}
//     expect(service).toBeDefined();
//   });
// });

// SchedulesService를 테스트할 거임.(테스트 대상을 모셔옴)
import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';

// describe는 문자열(이름), 콜백함수(수행될 코드)를 파라미터로 받음
describe('schedulesService', () => {
  // 테스트 스위트 전체에서 사용할 ScheduleService를 선언함
  let schedulesService: SchedulesService;

  beforeEach(async () => {
    // 테스트 모듈을 만들어준다.
    const module: TestingModule = await Test.createTestingModule({
      // 실제로 주입될 의존성을 나타낸다.
      providers: [SchedulesService],
    }).compile(); // compile 함수를 사용해서 모듈 생성을 완료함(비동기로 처리된다.)
  });
});
