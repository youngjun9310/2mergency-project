import { Test, TestingModule } from '@nestjs/testing';
import { GroupMembersController } from './group-members.controller';
import { GroupMembersService } from './group-members.service';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import { MembersRoleStrategy } from './strategies/members.strategy';
import { memberRolesGuard } from './guard/members.guard';

describe('GroupMembersController', () => {
  // 테스트 중에 사용할 변수 선언
  let controller: GroupMembersController;
  let service: GroupMembersService;

  // 각 테스트가 실행되기 전에 이 함수 안에 정의된 코드를 실행함 -> 테스트가 실행될 때마다 동일한 초기 상태 보장
  beforeEach(async () => {
    // 모의 MembersRoleStrategy
    const mockMembersRoleStrategy = {};

    // TestingModule 인스턴스 생성 -> 테스트 환경에서 컨트롤러와 서비스를 포함한다.
    const module: TestingModule = await Test.createTestingModule({
      // 이 테스트 모듈에 포함할 컨트롤러를 배열로 지정
      controllers: [GroupMembersController],
      // 이 테스트 모듈에 포함할 서비스를 제공. 실제 서비스 대신 모의 객체 사용
      providers: [
        {
          provide: GroupMembersService,
          useValue: {
            inviteUserToGroup: jest.fn((groupId, userId, email) => {
              if (email === 'kim@gmail.com') {
                throw new HttpException(
                  '유저가 존재하지 않습니다',
                  HttpStatus.NOT_FOUND,
                );
              }
              return Promise.resolve({ message: '초대를 완료했습니다.' });
            }),
          },
        },
        {
          provide: MembersRoleStrategy,
          useValue: {}, // MemberRoleStrategy에 대한 모의 객체 ;
        },
        {
          provide: memberRolesGuard,
          useFactory: () => jest.fn().mockImplementation(() => true),
          // memberRolesGuard 모의 구현.
        },
      ],
    }).compile(); // 모듈을 컴파일,

    controller = module.get<GroupMembersController>(GroupMembersController);
    // 컴파일 된 모듈에서 GroupMembersController 가져옴 -> 테스트에서 컨트롤러의 인스턴스에 접근
    service = module.get<GroupMembersService>(GroupMembersService);
  });

  // 멤버 초대 성공
  it('그룹에 멤버 초대 성공', async () => {
    // 멤버 초대시 필요한 모의 데이터
    const groupId = 1;
    const user = new Users();
    user.userId = 123;
    const dto = new InviteMemberDto();
    dto.email = 'safe@gmail.com';

    const result = await controller.inviteUserToGroup(groupId, user, dto);
    // inviteUserToGroup 호출 결과를 저장하기 위한 변수 선언 -> groupId, user, dto 인자

    // expect() 함수는 테스트에서 예상되는 결과를 선언하는데 사용함 !
    expect(result).toEqual({ message: '초대를 완료했습니다.' }); // 결과가 예상과 일치하는지 검증
    expect(service.inviteUserToGroup).toHaveBeenCalledWith(
      groupId,
      123,
      'safe@gmail.com',
    );
    // 그룹 서비스의 inviteUserToGroup 함수가 특정 인자들과 함께 올바르게 호출되었는지 검증하기.
    // .toHaveBeenCalledWith groupId, 123,'kim@gmail.com', 세 개의 인자를 받아 호출 받았는지 검사
  });

  // 초대하려는 멤버가 없는 경우
  it('유저가 존재하지 않습니다.', async () => {
    const groupId = 1;
    const user = new Users();
    user.userId = 123;
    const dto = new InviteMemberDto();
    dto.email = 'kim@gmail.com';

    // 컨트롤러의 inviteUserToGroup을 호출할 때 예외가 발생하는지 검증하기
    await expect(
      controller.inviteUserToGroup(groupId, user, dto),
    ).rejects.toThrow(
      // .rejects 는 프로미스가 거부 될 것을 예상하여 테스트 한다는 뜻
      // .toThrow  는 거부된 프로미스가 특정 예외를 던지는지를 검증하는 것 !
      new HttpException('유저가 존재하지 않습니다', HttpStatus.NOT_FOUND),
    );
  });

  it('이메일 일치, 유저의 그룹 초대 수락하기', async () => {
    const groupId = 1;
    const currentUser = new Users();
    currentUser.userId = 123;
    currentUser.email = 'user@example.com';

    const email = 'user@example.com';

    const result = await controller.acceptInvitation(
      groupId,
      currentUser,
      email,
    );

    expect(result).toEqual({ message: '초대를 수락했습니다.' });
    expect(service.acceptInvitation).toHaveBeenCalledWith(groupId, 123, email);
  });

  it('이메일 불일치, 그룹 초대 수락 실패 반환하기', async () => {
    const groupId = 1;
    const currentUser = new Users();
    currentUser.userId = 123;
    currentUser.email = 'user@example.com';

    const email = 'other@example.com';

    await expect(
      controller.acceptInvitation(groupId, currentUser, email),
    ).rejects.toThrow(
      new UnauthorizedException(
        `${email} 주소가 현재 로그인한 사용자의 이메일${currentUser.email}과 일치하지 않습니다.`,
      ),
    );
  });
});
