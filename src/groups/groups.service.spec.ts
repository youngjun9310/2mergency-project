import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { AppModule } from 'src/app.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groups } from './entities/group.entity';

describe('GroupsService', () => {
  let Service: GroupsService;

  const mockGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  
  /** DTO - createUserInput */
  interface Groups {
    title: string;
    content: string;
    category: string;
  }
  
  const createUserDto: Groups = {
    title: '그룹 제목',
    content: '그룹 내용',
    category: 'walk',
  };
  
  describe('GroupsService', () => {
    let groupsService;
    let mockRepository : Repository<Groups>;
  
    beforeEach(async () => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.restoreAllMocks();
  
      const module: TestingModule = await Test.createTestingModule({
        imports : [ConfigModule.forRoot({ isGlobal: true }),
          TypeOrmModule.forRoot()
        ],
        controllers: [GroupsController],
        providers: [
          GroupsService,
          {
            provide: GroupsService,
            useValue: mockGroupService,
          },
        ],
      }).compile();
  
      Service = module.get<GroupsService>(GroupsService);
      mockRepository = module.get<Repository<Groups>>(getRepositoryToken(Groups));
    });

    afterEach(() => { 
      jest.clearAllMocks();
    });

    // describe('create', () => {
    //   if('should create a new group', async () => {
    //     const groupId = 1;
    //     const mockGroup : Groups = { groupId : 1, title : '그룹 제목', }
    //   })
    // });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports : [AppModule],
  //     providers: [GroupsService],
  //   }).compile();

  //   
  // });

  it('should be defined', () => {
    expect(groupsService).toBeDefined();
  });
});
});
