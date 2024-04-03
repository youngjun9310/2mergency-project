import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;

  const mockUserService = {
    checkInfo: jest.fn(),
    checkValidatePwd: jest.fn(),
    createUser: jest.fn(),
  };
  
  /** Redis Mocking*/
  const mockAccessTokenPool = {
    get: jest.fn(),
  };
  
  /** DTO - createUserInput */
  interface IUser {
    id: string;
    password: string;
    nickName?: string;
  }
  
  const createUserDto: IUser = {
    id: 'user123',
    password: '12345!@fd',
    nickName: '홍길동',
  };
  
  // describe('UserController', () => {
  //   let userController;
  //   let userService;
  
  //   beforeEach(async () => {
  //     jest.clearAllMocks();
  //     jest.resetAllMocks();
  //     jest.restoreAllMocks();
  
  //     const module: TestingModule = await Test.createTestingModule({
  //       controllers: [UserController],
  //       providers: [
  //         {
  //           provide: UserService,
  //           useValue: mockUserService,
  //         },
  //         {
  //           provide: getRedisToken('access_token'),
  //           useValue: mockAccessTokenPool,
  //         },
  //       ],
  //     }).compile();
  
  //     userController = module.get<UserController>(UserController);
  //     userService = module.get<UserService>(UserService);
  //   });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
