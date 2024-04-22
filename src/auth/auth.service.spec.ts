import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Invites } from './entities/invite.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';
import { Repository } from 'typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { mocked } from 'jest-mock';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
//  Jest의 모킹 기능을 사용 -> bcrypt 라이브러리를 모킹, 비밀번호 해싱 함수 `hash`가 실제로 실행되지 않고, (bcrypt 라이브러리의 hash 함수를 가짜 함수로 대체)
//  호출될 때마다 'hashedPassword'라는 고정된 문자열/ 약속된 값을 ('hashedPassword') 반환하도록 설정,
//  실제로 복잡한 해싱 연산을 수행하지 않고도 테스트 환경에서 일관된 결과를 얻을 수 있다.

describe('AuthService', () => {
  // `describe` 함수는 하나의 테스트 스위트를 정의.  Jest에서 제공하는 테스트 그룹화 방법이다.
  // 이 경우 'AuthService'라는 이름의 테스트 스위트가 생성, AuthService와 관련된 여러 테스트 케이스들을 포함할 수 있다.

  // 테스트 도중 사용될 변수들을 선언. 이 변수들은 각각의 테스트 케이스에서
  // AuthService 인스턴스, userRepository, invitesRepository 등을 참조하기 위해 사용된다.
  let authService: AuthService;
  let userRepository: Repository<Users>;
  let invitesRepository: Repository<Invites>;
  let jwtService: JwtService;
  let configService: ConfigService;
  let awsService: AwsService;

  beforeEach(async () => {
    // 각 테스트 실행 전에 수행될 작업을 정의합니다. 비동기 함수인 beforeEach는 테스트 모듈이
    // 완전히 설정될 때까지 기다리기 위해 async/await 구문을 사용

    const module: TestingModule = await Test.createTestingModule({
      // TestingModule을 구성하기 위해 NestJS의 Test.createTestingModule 함수를 호출.
      // 이 함수는 테스트에 필요한 서비스들과 모의 객체들을 포함한 모듈을 생성
      providers: [
        AuthService,
        // AuthService를 테스트 모듈의 공급자로 추가.
        // 테스트 중 AuthService의 인스턴스가 필요할 때 종속성 주입 시스템이 사용할 수 있도록 함.
        {
          provide: getRepositoryToken(Users), // getRepositoryToken(Users)는 Users 엔티티에 대한 저장소 토큰을 생성
          useValue: {
            // useValue는 해당 토큰에 대해 사용할 값을 정의
            findOne: jest.fn(),
            save: jest.fn(),
          },
          // findOne과 save 함수를 jest.fn()으로 모킹하여 실제 데이터베이스에 접근하지 않고, 함수들의 호출을 추적할 수 있도록 한다.
        },
        {
          provide: getRepositoryToken(Invites), // InvitesRepository 모킹
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService, // JwtService의 모의 구현을 제공
          useValue: {}, // 특별한 동작을 모킹하지 않으므로 빈 객체를 사용
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'ENV_PASSWORD_HASH_ROUNDS') return 12;
              if (key === 'ENV_ROLE_ADMIN_PASSWORD') return 'adminSecret';
            }),
          },
        },
        {
          provide: AwsService,
          useValue: {
            imageUpload: jest.fn().mockResolvedValue('profileImageUrl'),
          },
          // AwsService를 모킹하여 imageUpload 함수가 호출될 때 'profileImageUrl'을 반환하도록 설정.
          // 이는 프로필 이미지 업로드 로직을 테스트할 때 사용함
        },
      ],
    }).compile(); // 구성된 모듈을 컴파일하여 사용할 준비

    // 모듈에서 AuthService 인스턴스를 가져와 변수에 할당
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(Users));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    awsService = module.get(AwsService);
    invitesRepository = module.get(getRepositoryToken(Invites)); // InvitesRepository 초기화
  });

  // 선언된 변수를 초기화합니다.
  // signUpDto 객체를 정의. register 함수에 전달될 사용자 정보를 포함
  const signUpDto = {
    nickname: '어드민',
    email: 'admin@example.com',
    password: 'admin123',
    passwordConfirm: 'admin123',
    adminPassword: 'aaadmin',
    address: '서울시 어쩌구',
  };
  //fileMock 객체를 생성. Express의 Multer.File 파일 업로드 테스트 시 사용
  const fileMock = {} as Express.Multer.File;

  /**
   * 회원가입
   * */

  //isOpen: boolean,

  it('회원가입 성공', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
    // userRepository의 findOne 메소드를 모킹, 이메일 중복 검사 시 항상 null을 반환하도록 설정.
    // null 반환은 해당 이메일로 등록된 사용자가 없음을 의미
    await expect(authService.register(signUpDto, fileMock)).resolves.toEqual({
      statusCode: 201,
      message: '회원가입에 성공하였습니다.',
    });
    expect(userRepository.save).toHaveBeenCalled();
    // userRepository의 save 메소드가 호출되었는지 확인.
    // save는 새 사용자 객체를 데이터베이스에 저장하는 함수.
    // 이 호출 검증은 사용자 데이터가 실제로 저장 과정을 거쳤는지 확인.
  });

  it('이미 가입된 이메일 있다면 에러 반환하기', async () => {
    mocked(userRepository.findOne).mockResolvedValueOnce(new Users()); // 이메일 중복
    // userRepository.findOne 메소드가 new Users()를 반환하도록 설정하여 이메일이 이미 존재한다고 가정
    await expect(authService.register(signUpDto, fileMock)).rejects.toThrow(
      // rejects.toThrow(ConflictException)을 사용하여 에러 타입이 ConflictException인지 확인합니다. 이메일 중복에 대한 에러 처리를 확인
      ConflictException,
    );
  });

  it('이미 중복된 닉네임이 있다면 에러 반환하기', async () => {
    mocked(userRepository.findOne)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Users()); // 닉네임 중복
    await expect(authService.register(signUpDto, fileMock)).rejects.toThrow(
      // rejects.toThrow(ConflictException)을 사용하여 닉네임 중복 시 발생하는 예외가 ConflictException인지 확인
      ConflictException,
    );
  });

  it('암호가 일치하지 않으면 에러 반환하기', async () => {
    const wrongPasswordDto = { ...signUpDto, passwordConfirm: 'wrongPassword' };
    await expect(
      authService.register(wrongPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
    // rejects.toThrow(UnauthorizedException)을 사용하여 비밀번호 불일치 시 UnauthorizedException 에러가 발생하는지 확인
  });

  /**
   * 어드민 회원가입
   * */

  it('should successfully register an admin', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
    await expect(
      authService.adminRegister(signUpDto, fileMock),
    ).resolves.toEqual({
      statusCode: 201,
      message: '어드민 회원가입에 성공하였습니다.',
    });
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(new Users());
    await expect(
      authService.adminRegister(signUpDto, fileMock),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if nickname already exists', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Users());
    await expect(
      authService.adminRegister(signUpDto, fileMock),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException if passwords do not match', async () => {
    const wrongPasswordDto = { ...signUpDto, passwordConfirm: 'wrongPassword' };
    await expect(
      authService.adminRegister(wrongPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if admin password is incorrect', async () => {
    const wrongAdminPasswordDto = {
      ...signUpDto,
      adminPassword: 'wrongAdminPassword',
    };
    await expect(
      authService.adminRegister(wrongAdminPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
  });
});
