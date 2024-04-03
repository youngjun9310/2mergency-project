import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ENV_MAILER_EMAIL, ENV_MAILER_HOST, ENV_MAILER_PASSWORD } from 'src/const/env.keys';
import { SendOption } from './interface/SendOption';



@Injectable()
export class MailService {
    private transporter;
    private readonly configService : ConfigService;
    

  constructor(configService : ConfigService) {
    this.configService = configService;
    this.transporter = nodemailer.createTransport({
      host : configService.get<string>(ENV_MAILER_HOST),
      secure: true,
      auth: {
        user: configService.get<string>(ENV_MAILER_EMAIL),
        pass: configService.get<string>(ENV_MAILER_PASSWORD),
      }
    });
  }

  async groupsendMail(email : string, token : number, nickname : string) {
    try {

      const sendOption : SendOption = {
        from: this.configService.get<string>(ENV_MAILER_EMAIL), 
        to: email,
        subject: `${nickname}님이 그룹 초대를 보냈습니다`,
        html: `<h1> 그룹에 당신을 초대하였습니다. </h1> <br>
        <p> 인증번호를 입력해주세요! : ${token} </p>`,
      };
      console.log(sendOption)

      await this.transporter.sendMail(sendOption);
      console.log('메일이 전송되었습니다')
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
}
