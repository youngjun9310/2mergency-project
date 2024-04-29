import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { DeleteResult, Repository } from 'typeorm';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { NotFoundException } from '@nestjs/common';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { Category } from 'src/types/Category.type';
import { UpdateGroupDto } from './dto/update-group.dto';

// 'describe' 함수는 Jest에서 제공하는 테스트 스위트를 정의하는 함수이다.
describe('GroupsService', () => {
  // 테스트에서 사용할 변수들을 선언하기
  let service: GroupsService; // GroupsService의 인스턴스를 저장 => 이 메서드를 호출하여 기대하는 동작과 결과를 검증
  let groupRepository: jest.Mocked<Repository<Groups>>; // Groups 엔티티에 대한 데이터 접근을 추상화하는 repository의 mocked 버전을 저장
  // Repository<Groups>는 TypeORM 라이브러리에서 제공하는 저장소 인터페이스이며, 데이터베이스에서 Groups 엔티티와 관련된 CRUD작업을 수행한다.
  // jest.Mocked은 해당 객체의 모든 메소드가 Jest의 모의 함수로 대체된 것을 의미, 이를 통해 메소드 호출, 반환 값, 예외 등을 자유롭게 설정할 수 있음.
  let groupMembersRepository: jest.Mocked<Repository<GroupMembers>>; // GroupMembers 엔티티에 대한 접근을 관리하는 Repository<GroupMembers>의 모의 버전을 저장
  // GroupMembers 엔티티는 그룹과 사용자 간의 관계를 나타내는 엔티티로, 사용자가 어떤 그룹의 멤버인지와 그 역할 등을 저장

  // 'beforeEach'는 각 테스트 케이스가 실행되기 전에 실행되는 설정 블록을 정의
  beforeEach(async () => {
    // TestingModule을 설정하여 이 모듈은 테스트 환경에서 필요한 의존성들을 제공
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Groups), // Groups 엔티티에 대한 저장소 토큰을 제공
          useValue: {
            // 각 데이터베이스 연산을 대신할 모의 함수들을 설정
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GroupMembers), // GroupMembers 엔티티에 대한 저장소 토큰을 제공
          useValue: {
            save: jest.fn(), // save 연산을 대신할 모의 함수를 설정
          },
        },
      ],
    }).compile(); // 설정된 모듈을 컴파일

    service = module.get<GroupsService>(GroupsService);
    // TestingModule 인스턴스인 module에서 GroupsService 타입의 인스턴스를 가져오는 함수 호출
    // get<T>() 메서드는 제네릭 타입 T를 사용하여, 반환될 서비스의 타입을 명시 => GroupsService 클래스의 인스턴스를 요청하고 있음
    // 이 메서드를 통해 요청된 서비스의 인스턴스를 반환함, 만약 해당 서비스가 모듈에 등록되어 있다면, DI 컨테이너는 이를 인식하고 인스턴스를 제공.

    groupRepository = module.get(getRepositoryToken(Groups));
    // getRepositoryToken(Groups)는 TypeORM과 NestJS가 함께 사용될 때, Groups에 대한 저장소 객체를 가져오기 위해 필요한 토큰을 생성한다.
    // Groups 엔티티를 인자로 받아, 해당 엔티티 타입에 연결된 저장소 객체에 접근하기 위한 유일한 토큰을 반환함
    // module.get()은 이 토큰을 사용하여 의존성 주입 시스템에서 Groups 엔티티의 저장소 객체를 가져옴
    // 이 객체는 데이터베이스 작업을 수행하는 메서드(save, find 등)를 포함, 테스트에서는 이 메서드들을 모의하여 사용한다.

    groupMembersRepository = module.get(getRepositoryToken(GroupMembers));
    // GroupMembers 엔티티를 위한 저장소 토큰을 생성하고, module.get()은 이 토큰을 사용하여 해당 엔티티의 저장소 객체를 반환 받는다.
    // 반환된 groupMembersRepository 객체는 GroupMembers 엔티티와 관련된 데이터베이스 작업을 수행하는 데 사용되며, 테스트에서는 주로 save 메서드가 모의된다.
  });

  /** *
   * 그룹 생성 *
   **/

  describe('createGroup', () => {
    it('새 그룹 생성하기', async () => {
      // 테스트에 사용될 입력 데이터를 정의
      const createGroupDto: CreateGroupDto = {
        title: '가상 그룹',
        content: '가상 그룹 내용',
        category: Category.hiking,
      };
      const userId = 1; // 사용자 Id 설정
      // 성공적인 그룹 생성시 예상되는 결과 데이터를 정의
      const expectedGroup: Groups = {
        groupId: 1,
        title: createGroupDto.title,
        content: createGroupDto.content,
        category: createGroupDto.category,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        schedules: [],
        scheduleMembers: [],
        groupMembers: [],
      };
      // 성공적인 그룹 멤버 생성시 예상되는 결과 데이터를 정의
      const expectedGroupMember: GroupMembers = {
        groupMemberId: 1,
        groupId: expectedGroup.groupId,
        userId,
        role: MemberRole.Main,
        isVailed: true,
        isInvited: true,
        users: null, // 실제 연관 관계를 설정하기 전은 null로 가정한다.
        groups: null,
      };
      // 모의 저장소의 save 함수가 위에서 정의된 결과 데이터를 반환하도록 설정
      // mocking 기능을 사용하여 테스트 동안 groupRepository와 groupMembersRepository의 save 메소드 호출 결과를 사전에 정의된 값으로 설정한다.
      // 즉, 이를 통해 실제 데이터베이스 작업을 수행하지 않고도 해당 메소드 호출이 예상대로 동작하는지 테스트할 수 있음

      groupRepository.save.mockResolvedValue(expectedGroup);
      // groupRepository는 Groups 엔티티에 대한 저장소 객체를 참조하며, save 메소드는 엔티티를 데이터베이스에 저장하는 역할
      // save 함수가 호출될 때 프로미스(Promise)가 성공적으로 해결(resolve)되면 expectedGroup 객체를 반환하도록 설정
      // GroupsService의 createGroup 메서드가 내부적으로 groupRepository.save를 호출할 때, 데이터베이스에 접근하지 않고도 expectedGroup 객체를 반환 결과로 받을 수 있게 해준다.
      // expectedGroup 객체는 테스트를 위해 미리 정의된 Groups 엔티티의 인스턴스로, 이 메소드의 실행 결과를 예측 가능하게 한다.

      groupMembersRepository.save.mockResolvedValue(expectedGroupMember);

      // 실제 서비스의 createGroup 메서드를 호출하고 결과를 확인
      const result = await service.createGroup(createGroupDto, userId);
      // GroupsService 클래스의 createGroup 메서드를 호출, 새로운 그룹을 생성하고 해당 그룹의 멤버를 추가하는 로직을 수행함
      // createGroupDto는 그룹 생성에 필요한 데이터(제목, 내용, 카테고리 등)를 담은 객체이고, userId는 그룹을 생성하는 사용자의 식별자
      // result 변수에 저장되며, 이 변수를 사용하여 실제 생성된 그룹 정보가 기대와 일치하는지 검증한다.

      // groupRepository의 save 메서드가 올바른 인자로 호출되었는지 확인
      expect(groupRepository.save).toHaveBeenCalledWith(
        // expect 함수는 Jest의 '단언'기능을 제공, 특정 조건이 만족하는지 검사함.
        // groupRepository.save는 그룹 엔티티를 데이터베이스에 저장하는 메서드로, 예상대로 호출되었는지, 올바른 인자와 함께 실행되었는지 확인함
        // toHaveBeenCalledWith는 save 메서드가 특정 인자로 호출되었는지를 검증

        expect.objectContaining({
          // expect.objectContaining는 주어진 객체가 예상 객체의 구조와 일치하는지를 검사한다.
          // createGroupDto에서 제공된 title, content, category 값이 실제로 save 메서드에 전달되었는지 확인함
          title: createGroupDto.title,
          content: createGroupDto.content,
          category: createGroupDto.category,
        }),
      );

      expect(groupMembersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId: expectedGroup.groupId,
          userId,
          role: 'Main',
        }),
      );

      // 최종 반환된 결과가 예상 결과와 동일한지 확인
      expect(result).toEqual(expectedGroup);
      // expect 함수는 Jest에서 테스트 대상의 결과 또는 값을 평가하기 위해 사용. 테스트 대상이 제공한 result 값을 받아, 특정 조건이 만족되는지를 검사한다.
      // result는 GroupsService의 createGroup 메서드가 호출된 후 반환된 값으로, 이 값은 신규 생성된 그룹 객체를 나타내며, 이 객체의 구조와 내용이 기대값과 일치하는지 검증할 필요가 있음

      // .toEqual는 Jest의 매처 중 하나로, 주어진 두 객체가 값뿐만 아니라 그 구조까지 완전히 동일한지를 검사함 => 객체 내의 모든 필드가 기대하는 값과 정확히 일치하는지 확인하기 위해 사용
      // expectedGroup은 테스트 전에 설정된, createGroup 메서드 호출의 예상 결과를 담은 객체로, 테스트에서 GroupsService가 생성해야 할 그룹의 모델을 나타낸다.
      // .toEqual 매처를 사용함으로써, createGroup 메서드의 실제 실행 결과인 result 객체가 expectedGroup 객체와 정확히 동일한지 확인
      // 모든 속성 값(제목, 내용, 카테고리, 접근성, 생성 및 수정 날짜 등)이 기대와 일치해야 함,
    });

    it('그룹 생성 중 에러 발생 시', async () => {
      const createGroupDto: CreateGroupDto = {
        title: '가상 그룹',
        content: '가상 그룹 내용',
        category: Category.hiking,
      };
      const userId = 1;

      // 모의 저장소의 save 함수가 에러를 발생하도록 설정
      const mockError = new Error('그룹 생성 중 에러 발생');
      groupRepository.save.mockRejectedValue(mockError);

      // createGroup 메서드 호출 시 에러가 발생하는지 확인
      await expect(service.createGroup(createGroupDto, userId)).rejects.toEqual(
        mockError,
      );

      // groupRepository.save 메서드가 호출되었는지 확인
      expect(groupRepository.save).toHaveBeenCalledWith({
        title: createGroupDto.title,
        content: createGroupDto.content,
        category: createGroupDto.category,
      });
    });
  });

  /** *
   * 그룹 모든 목록 조회 *
   **/

  describe('findAllGroups', () => {
    it('모든 그룹 목록 조회', async () => {
      const expectedGroups = [
        // 실제 그룹 엔티티 속성 반영하기
        {
          groupId: 1,
          title: 'Group 1',
          content: 'Content 1',
          category: Category.running,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          schedules: [],
          scheduleMembers: [],
          groupMembers: [],
        },
        {
          groupId: 2,
          title: 'Group 2',
          content: 'Content 2',
          category: Category.hiking,
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          schedules: [],
          scheduleMembers: [],
          groupMembers: [],
        },
      ];
      groupRepository.find.mockResolvedValue(expectedGroups);

      const result = await service.findAllGroups();

      expect(groupRepository.find).toHaveBeenCalled(); //저장소의 find 메소드가 호출되었는지 확인
      expect(result).toEqual(expectedGroups); // 반환된 결과가 예상된 그룹 리스트와 일치하는지 검증
    });

    it('데이터가 없을 경우 빈 배열 반환', async () => {
      // 데이터가 없는 상황을 모방
      groupRepository.find.mockResolvedValue([]);
      // 메서드를 모의하여, 데이터가 없는 상황에서 빈 배열 []을 반환하도록 설정 -> 데이터베이스에서 그룹을 조회했을 때 아무런 결과도 나타나지 않는 상황을 시뮬레이션함

      const result = await service.findAllGroups();
      // findAllGroups 메서드를 비동기적으로 실행하고, 그 결과를 result 변수에 저장. 내부적으로 groupRepository.find()를 호출하여 그룹 목록을 조회 한다.

      expect(groupRepository.find).toHaveBeenCalled(); // 저장소의 find 메소드가 호출되었는지 확인
      expect(result).toEqual([]); // findAllGroups 메서드가 반환한 결과가 빈 배열 []인지 확인
    });
  });

  /** *
   * 그룹 상세 목록 조회 *
   **/

  describe('findOneGroup', () => {
    it('그룹 상세 목록 조회', async () => {
      const groupId = 1;
      const expectedGroup = {
        groupId,
        title: 'Group 1',
        content: 'Content 1',
        category: Category.running,
        isPublic: true, // 엔티티 필드 반영
        createdAt: new Date(), // 엔티티 필드 반영
        updatedAt: new Date(), // 엔티티 필드 반영
        schedules: [], // 관계 필드를 빈 배열로 추가하여, 엔티티 간의 연관 관계가 존재할 경우 이를 모방함.
        scheduleMembers: [], // 관계를 반영하는 빈 배열
        groupMembers: [], // 관계를 반영하는 빈 배열
      };

      groupRepository.findOne.mockResolvedValue(expectedGroup);
      // groupRepository의 findOne 메서드를 모의로 설정하고, 호출될 때 expectedGroup 객체를 반환하도록 설정
      // mockResolvedValue는 비동기 함수가 성공적으로 해결될 때 주어진 값을 반환하도록 지시함

      const result = await service.findOneGroup(groupId);
      // GroupsService의 findOneGroup 메서드를 실행하고, 그 결과를 result 변수에 저장 -> groupId는 찾고자 하는 그룹의 아이디

      // 호출 검증하기
      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { groupId },
      });
      // expect를 사용해서 groupRepository.findOne이 정확한 인자({ where: { groupId } })와 함께 호출되었는지 확인함
      // 이는 메서드가 올바른 방식으로 데이터를 조회하도록 호출되었는지를 검사하는 것.

      expect(result).toEqual(expectedGroup); // 반환된 result가 expectedGroup와 동일한지 검사
    });

    // 그룹을 찾지 못했을 때
    it('해당 그룹을 찾지 못했을 경우', async () => {
      const groupId = 1;
      groupRepository.findOne.mockResolvedValue(undefined);
      // groupRepository의 findOne 메서드를 그룹을 찾지 못했을 때를 시뮬레이션하기 위해 undefined를 반환하도록 함.

      await expect(service.findOneGroup(groupId)).rejects.toThrow(
        new NotFoundException('그룹이 존재하지 않습니다.'),
      );
      // findOneGroup 메서드가 호출되었을 때 예외를 던지는지 검증
      // rejects.toThrow는 비동기 함수가 예외를 던질 것으로 예상될 때 사용
      // NotFoundException이 정상적으로 던져지는지 확인하여, 그룹이 존재하지 않을 때 서비스가 적절한 예외를 처리하는지 검사
    });
  });

  /** *
   * 그룹 모든 수정 *
   **/

  describe('updateGroup', () => {
    it('그룹 수정 및 업데이트', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: Category.hiking,
        isPublic: true,
      };
      const existingGroup = {
        groupId,
        title: 'Title',
        content: 'Content',
        category: Category.running,
        isPublic: false,
        createdAt: new Date(), // 실제 그룹 엔티티에 반드시 존재하는 필드
        updatedAt: new Date(), // 실제 그룹 엔티티에 반드시 존재하는 필드
        schedules: [],
        scheduleMembers: [],
        groupMembers: [],
      };

      groupRepository.findOne.mockResolvedValue(existingGroup);
      // groupRepository의 findOne 메소드 호출이 프로미스를 반환하고, 이 프로미스가 성공적으로 해결 될 때 existingGroup 객체를 결과로 반환하도록 설정
      // mockResolvedValue는 비동기 함수가 호출될 때 지정된 값을 성공적으로 반환하는 프로미스를 모의로 생성
      // existingGroup는 데이터베이스에서 기대하는 그룹의 데이터를 포함하고 있으며, 이 객체는 테스트에 사용될 예상되는 데이터를 표현함

      groupRepository.update.mockResolvedValue({
        // groupRepository의 update 메소드가 호출될 때, { affected: 1, raw: {}, generatedMaps: [] } 객체를 반환값으로 가진 프로미스를 반환하도록 모의 설정

        affected: 1, //  데이터베이스에 영향을 받은 레코드의 수를 나타내며, 이 경우 한 개의 레코드가 업데이트되었음을 의미
        raw: {}, // 실제 데이터베이스 쿼리 결과를 반영하는 필드 -> 데이터베이스의 원시 응답을 나타내며, 테스트에서는 특별한 데이터 없이 빈 객체를 사용
        generatedMaps: [], // 데이터베이스 연산 후 생성 또는 업데이트된 엔티티의 데이터를 포함하는 배열로 테스트에서는 비어 있음.
      });

      const result = await service.updateGroup(groupId, updateGroupDto);

      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { groupId },
      });
      //  groupRepository.findOne 메소드가 호출될 때, 인자로 where: { groupId } 객체가 제공되었는지를 검사
      //  groupId를 가진 그룹을 찾기 위한 조건을 명시
      // toHaveBeenCalledWith는 함수가 특정 인자로 호출되었는지 검증하는 데 사용
      //
      expect(groupRepository.update).toHaveBeenCalledWith(
        groupId,
        updateGroupDto,
      );
      // groupRepository.update 메소드가 groupId와 updateGroupDto를 인자로 받아 호출되었는지를 검사함
      // updateGroupDto는 업데이트하고자 하는 그룹의 새로운 데이터를 포함하고 있으며, groupId는 업데이트할 그룹의 식별자이다.

      expect(result).toEqual({
        // toEqual 매처는 주어진 두 객체가 값과 구조가 완전히 같은지 확인
        statusCode: 201,
        message: '성공적으로 그룹을 수정하였습니다.',
      });
    });

    it('수정할 해당 그룹이 없을 경우', async () => {
      const groupId = 1; // 테스트에서 사용할 그룹 id 지정
      const updateGroupDto: UpdateGroupDto = {
        // 수정할 그룹의 새로운 정보를 포함하는 디티오 정의
        title: 'Updated Title',
        content: 'Updated Content',
        category: Category.hiking,
      };

      groupRepository.findOne.mockResolvedValue(undefined);
      // groupRepository의 findOne 메소드를 모의하고, 해당 그룹 id로 그룹을 찾으려 할 때 undefined를 반환하도록 설정.
      // db에 해당 그룹이 존재하지 않는 상황을 시뮬레이션하기

      await expect(
        service.updateGroup(groupId, updateGroupDto),
      ).rejects.toThrow(
        new NotFoundException('해당 그룹이 존재하지 않습니다.'),
      );
      // service.updateGroup 메소드를 호출하고, 그 결과로 예외가 발생하는지 확인
      // rejects.toThrow를 사용하여 비동기 함수가 예외를 던질 것으로 예상되는 경우를 검증
    });
  });

  /** *
   * 그룹 삭제 *
   **/

  describe('deleteGroup', () => {
    it('그룹 삭제하기', async () => {
      const groupId = 1;
      const existingGroup = {
        groupId,
        title: 'Group to Delete',
        content: 'Content to Delete',
        category: Category.running,
        isPublic: true,
      };

      groupRepository.findOne.mockResolvedValue(existingGroup as Groups);
      groupRepository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      } as DeleteResult);

      const result = await service.deleteGroup(groupId);

      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { groupId },
      }); // 호출 검증 추가
      expect(groupRepository.delete).toHaveBeenCalledWith(groupId);
      expect(result).toEqual({
        statusCode: 201, // 상태 코드 수정
        message: '성공적으로 그룹을 삭제하였습니다.',
      });
    });

    it('삭제할 해당 그룹이 없는 경우', async () => {
      const groupId = 1;
      groupRepository.findOne.mockResolvedValue(undefined);

      await expect(service.deleteGroup(groupId)).rejects.toThrow(
        new NotFoundException('그룹이 존재하지 않습니다.'),
      );
    });
  });
});
