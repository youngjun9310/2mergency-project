import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { MailService } from "src/mail/mail.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JWTAuthGuard } from "./guard/jwt.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  /** 회원가입*/
  @ApiOperation({ summary: "회원가입 API", description: "회원가입 성공" })
  @UseInterceptors(FileInterceptor("profileImage"))
  @Post("register")
  @ApiResponse({ status: 201, description: "회원가입 성공하였습니다." })
  async register(@Body() signUpdto: SignUpDto, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {

      //이메일 인증번호 전송
      const gentoken = await this.mailService.usersendMail(signUpdto.email);

      //회원정보 DB 저장
      await this.authService.register(signUpdto, file);

      res.status(200).send(
        `<script>
          alert("회원가입에 성공하였습니다.");
          window.location.href = '/auth/users_h/emailAccept';
        </script>`,
      );
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === "ExistingEmailError") {
        res.status(401).send(`
          <script>
            alert("해당 이메일은 사용중입니다.");
            window.location.href = '/auth/users_h/register';
          </script>
        `);
      } else if (errorMsg === "ExistingNicknameError") {
        res.status(401).send(`
          <script>
            alert("해당 닉네임은 사용중입니다.");
            window.location.href = '/auth/users_h/register';
          </script>
        `);
      } else if (errorMsg === "PasswordMatchError") {
        res.status(401).send(`
          <script>
            alert("비밀번호가 일치하지 않습니다.");
            window.location.href = '/auth/users_h/register';
          </script>
        `);
      } else if (errorMsg === "EmailSendError") {
        res.status(400).send(`
          <script>
            alert("고객센터로 문의부탁드립니다.");
            window.location.href = '/auth/users_h/register';
          </script>
        `);
      } else {
        res.status(400).send(`
          <script>
            alert("회원가입을 다시 해주시기 바랍니다.");
            window.location.href = '/auth/users_h/register';
          </script>
        `);
      }
    }
  }

  /** 어드민 회원가입*/
  @ApiOperation({ summary: "어드민 회원가입 API", description: "어드민 회원가입 성공" })
  @UseInterceptors(FileInterceptor("profileImage"))
  @Post("adminRegister")
  @ApiResponse({ status: 201, description: "어드민 회원가입에 성공하였습니다." })
  async adminRegister(@Body() signUpdto: SignUpDto, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.adminRegister(signUpdto, file);
  }

  /** 로그인*/
  @ApiOperation({ summary: "로그인 API", description: "로그인 성공" })
  @Post("login")
  @HttpCode(200)
  @ApiResponse({ status: 200, description: "로그인에 성공하였습니다." })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const user = await this.authService.login(loginDto.email, loginDto.password);

      res.cookie("authorization", `Bearer ${user}`);
      res.status(200).send(`
            <script>
              alert("로그인 성공");
              window.location.href = '/Dashboard';
            </script>
          `);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === "NotExistingUser") {
        res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if (errorMsg === "PasswordError") {
        res.status(401).send(`
          <script>
            alert("비밀번호를 다시 확인해주시기바랍니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if (errorMsg === "EmailAuthError") {
        res.status(401).send(`
          <script>
            alert("이메일 인증이 필요합니다.");
            window.location.href = '/auth/users_h/emailAccept';
          </script>
        `);
      } else {
        res.status(400).send(`
          <script>
            alert("로그인을 다시 시도해주십시오.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  /** 로그아웃*/
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "로그아웃 API", description: "로그아웃 성공" })
  @ApiBearerAuth("access-token")
  @Post("logout")
  @HttpCode(204)
  @ApiResponse({ status: 204, description: "로그아웃에 성공하였습니다." })
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("authorization");
    return;
  }

  /** 이메일 가입수락*/
  @ApiOperation({
    summary: "이메일 가입수락 API",
    description: "이메일 가입 토큰번호 전송",
  })
  @ApiResponse({ status: 200, description: "이메일 가입 수락에 성공하였습니다." })
  @Post("accept")
  async userAccept(@Body("email") email: string, @Body("token") token: string, @Res() res: Response) {
    try {
      await this.authService.userAccept(email, token);

      res.status(200).send(`
          <script>
            alert("이메일인증에 성공했습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === "EmailNotExistError") {
        res.status(400).send(`
          <script>
            alert("이메일을 다시 입력해주시기 바랍니다.");
            window.location.href = '/auth/users_h/emailAccept';
          </script>
        `);
      } else if (errorMsg === "TokenNotMatch") {
        res.status(400).send(`
          <script>
            alert("토큰을 다시 입력해주시기 바랍니다.");
            window.location.href = '/auth/users_h/emailAccept';
          </script>
        `);
      } else {
        res.status(400).send(`
          <script>
            alert("고객센터에 문의해주십시오.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  /** hbs 양식 */
  // 회원가입 페이지
  @Get("/users_h/register")
  @Render("register")
  async registerpage() {
    return;
  }

  // 유저 이메일 인증요청
  @Get("/users_h/emailsend")
  @Render("emailSend")
  async emailsend() {
    return;
  }

  // 유저 이메일 인증
  @Get("/users_h/emailAccept")
  @Render("emailAccept")
  async emailaccept() {
    return;
  }

  // 유저 로그인
  @Get("/users_h/login")
  @Render("login")
  async logins() {
    return;
  }

  // 로그아웃
  @Get("/logout")
  async logout() {
    return;
  }
}
