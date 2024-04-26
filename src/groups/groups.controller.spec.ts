import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  NotFoundException,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common';
import { Category } from 'src/types/Category.type';
import { Users } from 'src/users/entities/user.entity';
import { Groups } from './entities/group.entity';
import { MembersRoleStrategy } from 'src/group-members/strategies/members.strategy';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';

// MockMembersRoleStrategy 클래스는 MembersRoleStrategy의 목업/가짜 구현.
// 이 클래스는 실제 복잡한 로직을 수행하지 않고, 단순화된 로직으로 테스트를 지원
class MockMembersRoleStrategy {
  // validate 메소드는 사용자 ID와 그룹 ID를 받아서,
  // 사용자가 해당 그룹에 접근할 수 있는지 여부를 판단하는 메소드.
  // 여기서는 실제 데이터베이스 조회나 복잡한 로직 대신 항상 true를 반환하여,
  // 모든 접근을 허용하도록 설정.
  // 이는 테스트 중에 특정 조건이나 상황을 제어하기 위해 사용.
  async validate(userId: number, groupId: number, context: ExecutionContext) {
    // 테스트 시나리오에 따라 다른 결과를 반환하도록 설정
    return true; // 모든 요청을 허용하도록 간단하게 설정
  }
}

// MockMemberRolesGuard 클래스는 memberRolesGuard의 목업(가짜)
// 이 가드는 API 엔드포인트에 대한 접근 제어를 담당
class MockMemberRolesGuard implements CanActivate {
  // MembersRoleStrategy 인스턴스를 생성자를 통해 받음.
  // 여기서는 목업 전략을 사용하여 실제 전략의 복잡한 로직을 대체함
  constructor(private strategy: MembersRoleStrategy) {}

  // canActivate 메소드는 요청이 특정 조건을 충족하는지 여부를 판단하여 접근을 허용할지 결정.
  // 목업 구현에서는 복잡한 조건 검사 대신 항상 true를 반환하며, 테스트 중에 모든 요청을 허용하도록 설정
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 직접 로직을 목업으로 대체
    return true; // 항상 접근 허용
  }
}

// describe 함수는 Jest에서 제공하는 테스트 스위트를 정의하는 함수.
// test suite (테스트 스위트)는 테스트 케이스(여기서 이것은 하나의 메소드를 테스트하기 위한 테스트 메소드를 의미)들을 하나로 묶은 것 ->그리고 그것은 자신의 테스트 케이스들을 실행함

// 'GroupsController'는 이 테스트 스위트의 이름입니다.
describe('GroupsController', () => {
  // let 키워드를 사용해 controller와 service 변수를 선언함.
  // 이 변수들은 각각 GroupsController 인스턴스와 GroupsService 인스턴스를 참조된다.
  let controller: GroupsController;
  let service: GroupsService;

  // beforeEach는 각 테스트 케이스가 실행되기 전에 실행되는 설정 블록을 정의
  beforeEach(async () => {
    // TestingModule을 설정 => 이 모듈은 테스트 환경에서 필요한 의존성들을 제공함
    const module: TestingModule = await Test.createTestingModule({
      // Test.createTestingModule => NestJS에서 제공하는 테스팅 유틸리티(테스트할 모듈의 구성요소를 정의)

      controllers: [GroupsController],
      // controllers 배열에는 이 테스트 모듈에서 사용할 컨트롤러를 등록한다.
      // 여기서는 GroupsController만 사용한다는 뜻

      providers: [
        // 테스트 환경에 포함될 서비스와 그 구현을 정의
        // GroupsService를 mocking하여 서비스의 실제 로직을 실행하지 않고도 테스트가 가능하게함
        // providers 배열에는 이 모듈에서 사용할 서비스 및 그 외의 의존성들을 등록함
        {
          provide: GroupsService,
          // GroupsService를 테스트 모듈의 DI(Dependency Injection) 컨테이너에 등록
          // provide 키는 의존성 주입 시스템에서 사용할 토큰을 지정합니다. => GroupsService를 의미

          useValue: {
            // useValue 옵션을 통해 실제 GroupsService 대신에 Jest의 mock 함수들로 구성된 객체를 사용 -> GroupsService의 각 메소드를 Jest의 jest.fn()으로 대체
            // 이 객체는 GroupsService가 제공해야 할 메서드들을 간단한 Jest mock 함수로 제공. => 실제 메소드를 호출하지 않고도 해당 메소드가 호출되었음을 추적하고, 필요한 경우 모의 반환값을 제공할 수 있도록 설정함
            createGroup: jest.fn(),
            findAllGroups: jest.fn(),
            findOneGroup: jest.fn(),
            updateGroup: jest.fn(),
            deleteGroup: jest.fn(),
          },
        },
        // 테스트 설정에서 MembersRoleStrategy 클래스를 주입하려고 할 때,
        // 실제 MembersRoleStrategy 대신 MockMembersRoleStrategy를 사용하도록 설정.
        // 이는 실제 MembersRoleStrategy의 복잡한 로직을 모방하는 간단한 버전으로,
        // 외부 서비스 호출이나 데이터베이스 접근 없이 테스트를 할 수 있게 해준다.
        {
          provide: MembersRoleStrategy, // 의존성 주입 시스템에게 MembersRoleStrategy 토큰을 사용할 것을 알려줌
          useClass: MockMembersRoleStrategy, // 실제로 주입될 클래스는 MockMembersRoleStrategy
        },

        // memberRolesGuard가 테스트 중에 사용될 때,
        // 실제 memberRolesGuard 대신 MockMemberRolesGuard를 사용하도록 설정.
        // MockMemberRolesGuard는 주로 특정 조건(예: 사용자 인증, 역할 검증)을 검사하는
        // canActivate 메서드를 간단하게 모방, 모든 요청을 허용하도록 설정할 수 있다.
        // 이를 통해 가드의 내부 로직을 신경 쓰지 않고 테스트할 수 있음.
        {
          provide: memberRolesGuard,
          useClass: MockMemberRolesGuard,
        },
      ],
    }).compile();
    // ompile 메서드를 호출하여 설정된 모듈을 컴파일함. -> 이 과정을 통해 NestJS는 컨트롤러와 서비스 등의 객체를 인스턴스화하고 의존성을 주입한다.

    controller = module.get<GroupsController>(GroupsController);
    // module.get 메서드를 사용해 컴파일된 모듈에서 GroupsController 인스턴스를 가져옴  -> 이 인스턴스는 테스트 케이스에서 사용된다.
    service = module.get<GroupsService>(GroupsService);
    // module.get 메서드를 사용해 컴파일된 모듈에서 GroupsService 인스턴스를 가져옴 -> 이 인스턴스는 컨트롤러 메서드의 내부 로직에서 사용된다.
  });

  // 가상 인스턴스
  const dto = new CreateGroupDto();
  dto.title = '새로운 그룹';
  dto.content = '가상 그룹';
  dto.category = Category.walk;

  const user = new Users();
  user.userId = 1; // 사용자 ID
  user.email = 'user@gmail.com'; // 기타 필요한 사용자 정보
  user.nickname = 'nickname';
  user.password = 'aaaa4321';

  const result = new Groups();
  result.groupId = 1;
  result.title = dto.title;
  result.content = dto.content;
  result.category = dto.category;
  result.isPublic = true; // 기본값으로 설정하기
  result.createdAt = new Date();
  result.updatedAt = new Date();

  /**
   * 그룹 생성 테스트
   */

  describe('createGroup', () => {
    // describe 블록을 사용하여 관련 테스트 케이스들을 그룹화함 : createGroup 기능의 테스트를 그룹화
    it('그룹 생성하기', async () => {
      // it 실제 테스트를 정의하는 함수로, '그룹 생성하기'라는 설명과 함께 비동기 테스트 함수를 정의
      const dto = new CreateGroupDto(); // CreateGroupDto: 그룹 생성을 위해 필요한 데이터 전송 객체를 생성 // 테스트에 사용될 가상의 데이터 인스턴스 생성하기
      dto.title = '새로운 그룹';
      dto.content = '가상 그룹';
      dto.category = Category.walk;

      const result: Groups = {
        groupId: 1,
        title: dto.title,
        content: dto.content,
        category: dto.category,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        // 타입스크립트에서는 객체를 특정 타입으로 선언할 때, 그 타입에 정의된 모든 속성을 포함해야한다.
        // 그룹 엔티티에 있는 애들 전부 넣어줘야함
        schedules: [], // 필요하다면 엔티티 속성을 넣어줘야함
        scheduleMembers: [],
        groupMembers: [],
      };

      jest.spyOn(service, 'createGroup').mockResolvedValue(result);
      // jest.spyOn: Jest의 스파이 기능을 사용하여 GroupsService의 createGroup 메소드 호출을 추적
      // mockResolvedValue: 비동기 함수인 createGroup이 호출될 때 지정된 result 객체를 반환하도록 설정
      // 실제 데이터베이스나 다른 외부 서비스에 의존하지 않고 테스트를 수행할 수 있게 해준다.

      expect(await controller.createGroup(dto, user)).toBe(result);
      // GroupsController의 createGroup 메소드를 호출하고, 필요한 dto와 user 객체를 전달 =>  메소드는 비동기적으로 처리되기 때문에 await를 사용하여 결과를 기다린다.
      // toBe(result): createGroup 메소드가 반환하는 결과가 mockResolvedValue에서 설정한 result 객체와 동일한지 확인
    });

    // 실패 케이스 테스트
    // 모든 필수 필드가 설정되지 않았을 때의 오류 처리를 검증
    it('필수 필드 누락으로 인한 그룹 생성 실패', async () => {
      const incompleteDto = new CreateGroupDto();
      // CreateGroupDto 인스턴스를 생성하되, 아무 필드도 설정하지 않음 -> 누락 상태 시뮬레이션 하는거임
      jest.spyOn(service, 'createGroup').mockRejectedValue(new Error('필수 필드가 누락되었습니다.'));
      // service의 createGroup 메서드가 호출될 때, Error를 반환하도록 설정
      // '필수 필드가 누락되었습니다.' 메시지와 함께 예외를 발생시킴

      await expect(controller.createGroup(incompleteDto, user)).rejects.toThrow(Error);
      // controller의 createGroup 메서드를 호출하고, 예외가 발생하는지 확인. => 예외가 정상적으로 발생하는지를 검증하여, 필드 검증 로직의 존재를 확인
    });

    // 데이터 유효성 검사 실패: 필드는 존재하지만, 값이 규칙을 위반할 때의 오류 처리를 검증
    it('데이터 유효성 검사 실패', async () => {
      const dto = new CreateGroupDto();
      dto.title = ''; // 유효하지 않은 입력 (비어있는 제목)
      dto.content = '유효하지 않은 그룹';
      dto.category = Category.walk;

      jest.spyOn(service, 'createGroup').mockRejectedValue(new BadRequestException('입력값이 유효하지 않습니다.'));
      await expect(controller.createGroup(dto, user)).rejects.toThrow(BadRequestException);
    });
  });

  /**
   * 그룹 모든 목록 조회 테스트
   */

  describe('findAllGroups', () => {
    // 그룹 목록 조회 기능을 테스트하는 코드 블록을 정의
    it('그룹 목록 조회하기', async () => {
      const result: Groups[] = [
        {
          groupId: 1,
          title: 'Group 1',
          content: '첫 번째 그룹의 내용',
          category: Category.walk, // 엔티티에 enum값으로 되어있음 -그래서 이렇게 해야된다.
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
          content: '두번째 그룹의 내용',
          category: Category.running,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          schedules: [],
          scheduleMembers: [],
          groupMembers: [],
        },
        {
          groupId: 3,
          title: 'Group 4',
          content: '세번째 그룹의 내용',
          category: Category.hiking,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          schedules: [],
          scheduleMembers: [],
          groupMembers: [],
        },
      ];
      jest.spyOn(service, 'findAllGroups').mockResolvedValue(result);
      // service의 findAllGroups 메서드가 호출될 때 result를 반환하도록 설정

      expect(await controller.findAllGroups()).toEqual(result);
      // controller의 findAllGroups 메서드를 호출하고, 결과가 result와 같은지 확인.
      // toEqual은 객체의 내용이 동일한지 비교.
    });

    // 그룹 데이터가 전혀 없을 경우를 테스트하는 코드 블록을 정의
    it('그룹 데이터가 없는 경우', async () => {
      jest.spyOn(service, 'findAllGroups').mockResolvedValue([]);
      // service의 findAllGroups 메서드가 호출될 때 빈 배열을 반환하도록 설정

      const response = await controller.findAllGroups();
      // controller의 findAllGroups 메서드를 호출하고, 결과가 빈 배열인지 확인.
      expect(response).toEqual([]); // 빈 배열로 반환되는지 확인
    });

    // 권한이 부족하여 그룹 목록 조회가 실패하는 경우를 테스트하는 코드 블록을 정의
    it('권한 부족으로 인한 그룹 목록 조회 실패', async () => {
      jest.spyOn(service, 'findAllGroups').mockRejectedValue(new ForbiddenException('권한이 없습니다.'));
      // controller의 findAllGroups 메서드를 호출할 때 예외가 발생하는지 확인.
      // 예외가 ForbiddenException 타입인지 검증
      await expect(controller.findAllGroups()).rejects.toThrow(ForbiddenException);
    });

    /**
     * 그룹 상세 조회 테스트
     */

    describe('findOneGroup', () => {
      it('그룹 상세 조회', async () => {
        const result: Groups = {
          // const result: Groups[] = [ {그룹어쩌구저쩌구}] 에서 -> 단일 객체로 변경해줘야함
          groupId: 1,
          title: 'Group 1',
          content: '첫 번째 그룹의 내용',
          category: Category.walk,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          schedules: [],
          scheduleMembers: [],
          groupMembers: [],
        };

        jest.spyOn(service, 'findOneGroup').mockResolvedValue(result);
        expect(await controller.findOneGroup(1)).toBe(result);
      });

      it('그룹을 찾을 수 없다면 오류 보내기', async () => {
        jest.spyOn(service, 'findOneGroup').mockRejectedValue(new NotFoundException());

        await expect(controller.findOneGroup(1)).rejects.toThrow(NotFoundException);
      });
    });
  });

  /**
   * 그룹 수정 테스트
   */

  describe('updateGroup', () => {
    it('그룹 업데이트', async () => {
      const dto = new UpdateGroupDto();
      dto.title = '새로운 그룹';
      dto.content = '가상 그룹';
      dto.category = Category.walk;
      dto.isPublic = true; // Optional 필드인 isPublic 설정

      // 서비스가 실제로 반환할 형태로 result 정의
      const result = {
        statusCode: 201,
        message: '성공적으로 그룹을 수정하였습니다.',
      };
      jest.spyOn(service, 'updateGroup').mockResolvedValue(result);

      expect(await controller.updateGroup(1, dto)).toBe(result);
    });
  });

  /**
   * 그룹 삭제 테스트
   */

  describe('deleteGroup', () => {
    it('그룹 삭제하기', async () => {
      const result = {
        statusCode: 201,
        message: '성공적으로 그룹을 삭제하였습니다.',
      };
      jest.spyOn(service, 'deleteGroup').mockResolvedValue(result);

      expect(await controller.deleteGroup(1)).toEqual(result);
    });
  });

  describe('deleteGroup', () => {
    it('존재하지 않는 그룹 삭제 시도', async () => {
      jest.spyOn(service, 'deleteGroup').mockRejectedValue(new NotFoundException('그룹을 찾을 수 없습니다.'));

      await expect(controller.deleteGroup(999)).rejects.toThrow(NotFoundException);
    });
  });
});
