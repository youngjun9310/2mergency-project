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
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<Users>;
  let invitesRepository: Repository<Invites>;
  let jwtService: JwtService;
  let configService: ConfigService;
  let awsService: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Invites),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
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
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(Users));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    awsService = module.get(AwsService);
    invitesRepository = module.get(getRepositoryToken(Invites));
  });

  const signUpDto = {
    nickname: '어드민',
    email: 'admin@example.com',
    password: 'admin123',
    passwordConfirm: 'admin123',
    adminPassword: 'adminSecret',
    address: '서울시 어쩌구',
  };
  const fileMock = {} as Express.Multer.File;

  describe('register', () => {
    it('회원가입 성공', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(authService.register(signUpDto, fileMock)).resolves.toEqual({
        statusCode: 201,
        message: '회원가입에 성공하였습니다.',
      });
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  it('이미 가입된 이메일 있다면 에러 반환하기', async () => {
    mocked(userRepository.findOne).mockResolvedValueOnce(new Users());
    await expect(authService.register(signUpDto, fileMock)).rejects.toThrow(
      ConflictException,
    );
  });

  it('이미 중복된 닉네임이 있다면 에러 반환하기', async () => {
    mocked(userRepository.findOne)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Users());
    await expect(authService.register(signUpDto, fileMock)).rejects.toThrow(
      ConflictException,
    );
  });

  it('암호가 일치하지 않으면 에러 반환하기', async () => {
    const wrongPasswordDto = {
      ...signUpDto,
      passwordConfirm: 'wrongPassword',
    };
    await expect(
      authService.register(wrongPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
  });

  describe('register', () => {
    it('어드민 회원가입 성공', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        authService.adminRegister(signUpDto, fileMock),
      ).resolves.toEqual({
        statusCode: 201,
        message: '어드민 회원가입에 성공하였습니다.',
      });
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  it('어드민 이메일이 중복일 경우 에러 반환하기', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(new Users());
    await expect(
      authService.adminRegister(signUpDto, fileMock),
    ).rejects.toThrow(ConflictException);
  });

  it('어드민 중복 닉네임이 있을 경우 에러 반환하기', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Users());
    await expect(
      authService.adminRegister(signUpDto, fileMock),
    ).rejects.toThrow(ConflictException);
  });

  it('암호가 일치하지 않다면 오류 반환하기', async () => {
    const wrongPasswordDto = {
      ...signUpDto,
      passwordConfirm: 'wrongPassword',
    };
    await expect(
      authService.adminRegister(wrongPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('관리자 암호가 일치하지 않다면 오류 반환하기', async () => {
    const wrongAdminPasswordDto = {
      ...signUpDto,
      adminPassword: 'wrongAdminPassword',
    };
    await expect(
      authService.adminRegister(wrongAdminPasswordDto, fileMock),
    ).rejects.toThrow(UnauthorizedException);
  });

  // login 메소드 테스트
  describe('login', () => {
    it('로그인 성공', async () => {
      const userMock = {
        userId: '1',
        email: 'user@example.com',
        password: 'hashedPassword',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login('user@example.com', 'password123');
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toBe('mockAccessToken');
    });
  });

  it('존재하지 않는 이메일로 로그인 시도', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    await expect(
      authService.login('wrong@example.com', 'password123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('잘못된 비밀번호로 로그인 시도', async () => {
    const userMock = {
      userId: '1',
      email: 'user@example.com',
      password: 'hashedPassword',
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(
      authService.login('user@example.com', 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  // userInvite 메소드 테스트
  describe('userInvite', () => {
    it('이메일 초대 성공', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(invitesRepository, 'save').mockResolvedValue({});

      await expect(
        authService.userInvite('new@example.com', {
          token: 12345,
          expires: new Date(),
        }),
      ).resolves.not.toThrow();
      expect(invitesRepository.save).toHaveBeenCalled();
    });
  });

  it('존재하는 이메일 재초대', async () => {
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockResolvedValue({ email: 'existing@example.com' });
    jest.spyOn(invitesRepository, 'delete').mockResolvedValue({});
    jest.spyOn(invitesRepository, 'save').mockResolvedValue({});

    await authService.userInvite('existing@example.com', {
      token: 54321,
      expires: new Date(),
    });
    expect(invitesRepository.delete).toHaveBeenCalled();
    expect(invitesRepository.save).toHaveBeenCalled();
  });

  // userAccept 메소드 테스트
  describe('userAccept', () => {
    it('가입 수락 성공', async () => {
      const tokenMock = {
        email: 'user@example.com',
        token: '12345',
        expires: new Date(new Date().getTime() + 60000),
      };
      jest.spyOn(invitesRepository, 'findOne').mockResolvedValue(tokenMock);
      jest.spyOn(userRepository, 'update').mockResolvedValue({});

      await expect(
        authService.userAccept('user@example.com', '12345'),
      ).resolves.not.toThrow();
      expect(invitesRepository.delete).toHaveBeenCalled();
    });
  });

  it('유효하지 않은 토큰으로 가입 시도', async () => {
    jest.spyOn(invitesRepository, 'findOne').mockResolvedValue(null);

    await expect(
      authService.userAccept('user@example.com', 'wrongToken'),
    ).rejects.toThrow(BadRequestException);
  });

  it('만료된 토큰으로 가입 시도', async () => {
    const expiredTokenMock = {
      email: 'user@example.com',
      token: '12345',
      expires: new Date(new Date().getTime() - 10000),
    };
    jest
      .spyOn(invitesRepository, 'findOne')
      .mockResolvedValue(expiredTokenMock);

    await expect(
      authService.userAccept('user@example.com', '12345'),
    ).rejects.toThrow(BadRequestException);
  });

  // uploadImg 메소드 테스트
  describe('uploadImg', () => {
    // 이미지 업로드 메소드에 대한 테스트를 구체적으로 추가하세요.
  });
});
