import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { JWTAuthGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { JWTAuthGuard } from './guard/jwt.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mailService: MailService;
  let mockFile: Express.Multer.File;
  let mockResponse: Partial<Response>;

  // 각 테스트가 실행되기 전 매번 실행되는 함수입니다.
  let authController: AuthController;
  let authService: AuthService;
  let mailService: MailService;
  let mockFile: Express.Multer.File;
  let mockResponse: Partial<Response>;

  // 각 테스트가 실행되기 전 매번 실행되는 함수입니다.
  beforeEach(async () => {
    // 테스트 모듈을 설정하고 컴파일, 이 모듈에는 테스트할 컨트롤러와 서비스가 포함된다.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController], // AuthController를 테스트 모듈에 등록
      providers: [
        // 의존성 주입을 설정
        {
          provide: AuthService, // 의존성 주입을 위해  AuthService 제공.
          useValue: {
            // 실제 AuthService를 대신할 모의 객체를 정의.
            // 각 메서드는 jest.fn()으로 모의 함수로 설정되어 있으며, 특정 값으로 해결힘
            register: jest.fn().mockResolvedValue({
              statusCode: 201, // register 호출 시 201 상태 코드와 메시지 반환
              message: '회원가입에 성공하였습니다.',
            }),
            adminRegister: jest.fn().mockResolvedValue({
              statusCode: 201,
              message: '어드민 회원가입에 성공하였습니다.',
            }),
            login: jest.fn().mockResolvedValue('accessToken'), // login 호출 시 accessToken 반환
            userInvite: jest.fn().mockResolvedValue(true), // userInvite 호출 시 true 반환
            userAccept: jest.fn().mockResolvedValue(true), // userAccept 호출 시 true 반환
          },
        },
        {
          provide: MailService, // MailService 의존성 주입을 위해 제공.
          useValue: {
            // MailService의 메서드를 모의 객체로 대체
            usersendMail: jest.fn().mockResolvedValue('gentoken'), // 성공적인 이메일 전송을 가정
          },
        },
        JWTAuthGuard, // JWTAuthGuard 제공
      ],
    }).compile(); // 모듈 컴파일

    // 모듈에서 인스턴스를 가져와 변수에 할당
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);

    // 테스트에 사용될 파일과 HTTP 응답 객체를 설정
    mockFile = {
      fieldname: 'profileImage',
      originalname: 'testimage.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './uploads',
      filename: 'testimage.png',
      path: 'uploads/testimage.png',
      size: 1024,
    } as Express.Multer.File;

    mockResponse = {
      // HTTP 응답을 모의하기 위한 객체
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(), // 체이닝을 위한 mockReturnThis
      json: jest.fn().mockReturnThis(),
    };
  });

  // describe 블록은 특정 기능에 대한 테스트 그룹을 정의
  describe('register', () => {
    // register 함수에대한 테스트 케이스들을 그룹화.
    it('회원가입 성공', async () => {
      // 'it' 함수는 개별 테스트 케이스를 정의. 여기서는 회원가입 성공을 테스트

      const signUpDto = new SignUpDto();
      signUpDto.email = 'test@example.com';
      signUpDto.password = 'password123';
      signUpDto.nickname = '닉네임';
      // 회원가입을 위해 필요한 정보를 담은 DTO를 생성

      jest.spyOn(authService, 'register').mockResolvedValue({
        statusCode: 201,
        message: '회원가입에 성공하였습니다.',
      });
      //auth 서비스의 register를 호출할 때, 지정된 registerResult 객체를 반환하도록 설정
      // jest.spyOn을 사용하여 authService의 register 검사
      // mockResolvedValue를 사용하여 메서드가 호출될 때 반환될 값을 지정

      const result = await authController.register(signUpDto, mockFile);
      // authControllr의 객체를 register 메서드 호출 -> signUpDto, mockFile인자로 받음

      expect(authService.register).toHaveBeenCalledWith(signUpDto, mockFile);
      // authService의 register 메서드가 호출되었는지 확인
      // toHaveBeenCalledWith를 사용하여 호출 시 사용된 인자들이 기대한 값과 일치하는지 검사

      expect(result).toEqual({
        statusCode: 201,
        message: '회원가입에 성공하였습니다.',
      });
      // 함수의 반환값이 예상한 객체와 일치하는지 확인.
      // toEqual을 사용하여 result 객체가 예상한 값과 정확히 일치하는지 검사
    });
  });

  describe('adminRegister', () => {
    it('어드민 회원가입 성공', async () => {
      const signUpDto = new SignUpDto();
      signUpDto.email = 'admin@example.com';
      signUpDto.password = 'password123';
      signUpDto.nickname = 'Admin User';

      jest.spyOn(authService, 'adminRegister').mockResolvedValue({
        statusCode: 201,
        message: '어드민 회원가입에 성공하였습니다.',
      });

      const result = await authController.adminRegister(signUpDto, mockFile);

      expect(authService.adminRegister).toHaveBeenCalledWith(signUpDto, mockFile);
      expect(result).toEqual({
        statusCode: 201,
        message: '어드민 회원가입에 성공하였습니다.',
      });
    });
  });

  describe('login', () => {
    // 'describe'login 함수에대한 테스트 케이스들을 그룹화.
    it('로그인 성공 및 토큰 설정', async () => {
      const loginDto = { email: 'user@example.com', password: 'password' };
      // 로그인을 위해 필요한 사용자 정보를 담고 있는 객체

      await authController.login(loginDto, mockResponse as any);
      // AuthController의 login 메소드를 호출, 응답 객체와 로그인 DTO를 전달.
      // mockResponse 객체는 Response 타입으로 캐스팅해서 사용
      const accessToken = 'accessToken'; // 동적 토큰 값 사용

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      // 'expect'와 'toHaveBeenCalledWith'를 사용하여 authService의 login 메소드가
      // 예상된 인자, 즉 email과 password와 함께 호출되었는지 확인

      expect(mockResponse.cookie).toHaveBeenCalledWith('authorization', `Bearer ${accessToken}`);
      // mockResponse의 cookie 메소드가 호출, 올바른 인자('authorization', `Bearer accessToken`)를 받았는지 확인
      // 로그인 후 토큰을 쿠키로 설정하는 과정을 테스트함
    });
  });

  describe('logOut', () => {
    it('로그아웃 성공 및 쿠키 삭제', async () => {
      await authController.logOut(mockResponse as any);
      // authController의 logOut 메서드 호출하여 로그아웃 시도

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('authorization');
      // mockResponse의 clearCookie 메서드가 'authorization' 쿠키를 삭제하는지 확인
    });
  });

  describe('userInvite', () => {
    it('사용자 초대 이메일 전송', async () => {
      const email = 'invite@example.com';

      await authController.userInvite(email, mockResponse as any);
      // authController의 userInvite 메서드를 호출하여 이메일을 전송

      expect(mailService.usersendMail).toHaveBeenCalledWith(email);
      // mailService의 usersendMail 메서드가 정확한 이메일 주소로 호출되었는지 확인

      expect(authService.userInvite).toHaveBeenCalledWith(email, 'gentoken');
      // authService의 userInvite 메서드가 정확한 이메일 주소와 토큰값으로 호출되었는지 확인

      expect(mockResponse.send).toHaveBeenCalledWith('회원가입 토큰번호를 전송했습니다.');
      // mockResponse의 send 메서드가 예상된 메시지를 포함하여 호출되었는지 확인
    });
  });

  describe('userAccept', () => {
    it('사용자 가입 수락', async () => {
      const email = 'newuser@example.com';
      const token = 'registrationtoken';

      await authController.userAccept(email, token, mockResponse as any);
      // authController의 userAccept 메서드를 호출하여 사용자 가입을 수락

      expect(authService.userAccept).toHaveBeenCalledWith(email, token);
      // authService의 userAccept 메서드가 정확한 이메일과 토큰값으로 호출되었는지 확인

      expect(mockResponse.send).toHaveBeenCalledWith('회원가입 이메일 인증을 완료했습니다.');
      // mockResponse의 send 메서드가 예상된 메시지를 포함하여 호출되었는지 확인
    });
  });
});
