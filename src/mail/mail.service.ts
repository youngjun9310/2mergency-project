import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { ENV_MAILER_EMAIL, ENV_MAILER_HOST, ENV_MAILER_PASSWORD } from "src/const/env.keys";
import { SendOption } from "./interface/SendOption";

@Injectable()
export class MailService {
  private transporter;
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>(ENV_MAILER_HOST),
      secure: true,
      auth: {
        user: configService.get<string>(ENV_MAILER_EMAIL),
        pass: configService.get<string>(ENV_MAILER_PASSWORD),
      },
    });
  }

  async usersendMail(email: string) {
    try {
      const genToken = await this.generateRandomToken(111111, 999999);
      const sendOption: SendOption = {
        from: this.configService.get<string>(ENV_MAILER_EMAIL),
        to: email,
        subject: "인증 토큰 발송",
        html: `<p>아래의 인증 토큰를 입력해주세요 !</p>
        <p>인증토큰 : ${genToken} </p>`,
      };

      await this.transporter.sendMail(sendOption);
      console.log("가입 토큰이 전송되었습니다");

      return genToken;
    } catch (error) {
      console.log("send error", error);
      throw new BadRequestException("가입 토큰 전송 중 오류가 발생했습니다.");
    }
  }

  async generateRandomToken(min: number, max: number) {
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
    return token.toString();
  }
}
