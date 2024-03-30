import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ENV_GOOGLE_ID, ENV_GOOGLE_Password } from 'src/const/env.keys';
import { SendOption } from './interface/SendOption';


@Injectable()
export class MailService {
    private transporter;
    private readonly configService : ConfigService;
    

  constructor(configService : ConfigService) {
    this.configService = configService;
    this.transporter = nodemailer.createTransport({
      host: 'gmail',
      secure: true,
      auth: {
        user: configService.get<string>(ENV_GOOGLE_ID),
        pass: configService.get<string>(ENV_GOOGLE_Password),
      }
    });
  }

  async groupsendMail(email : string, token : number, nickname : string) {
    try {

      const sendOption : SendOption = {
        from: this.configService.get<string>(ENV_GOOGLE_ID), 
        to: email,
        subject: `${nickname}님이 그룹 초대를 보냈습니다`,
        html: `<p> 그룹에 당신을 초대하였습니다. <br>
        인증번호를 입력해주세요! : ${token} </p>`,
      };

      await this.transporter.sendMail(sendOption);
      console.log('메일이 전송되었습니다')
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
}
