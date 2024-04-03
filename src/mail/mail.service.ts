import { BadRequestException, Injectable } from '@nestjs/common';
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
      host: configService.get<string>(ENV_MAILER_HOST),
      secure: true,
      auth: {
        user: configService.get<string>(ENV_MAILER_EMAIL),
        pass: configService.get<string>(ENV_MAILER_PASSWORD),
      }
    });
  }

  async usersendMail(email: string){
    try{
      const genToken = await this.generateRandomToken(111111,999999);
      const host = this.configService.get<string>(ENV_MAILER_HOST)
      console.log('genToken', genToken);
      const sendOption : SendOption = {
        from: this.configService.get<string>(ENV_MAILER_EMAIL),
        to: email,
        subject: `[${host}]인증 토큰 발송`,
        html: `<p>아래의 인증 토큰를 입력해주세요 !</p>
        <p>인증토큰 : ${genToken.token} </p>
        <p>This link will expire on ${genToken.expires}.</p>`
      };
      const result = await this.transporter.sendMail(sendOption);
      console.log('가입 토큰이 전송되었습니다');

      return genToken ;

    }catch(error){
      console.log('send error', error)
      throw new BadRequestException('가입 토큰 전송 중 오류가 발생했습니다.');
    }

  }

  async groupsendMail(email : string, token : number, nickname : string) {
    try {

      const sendOption : SendOption = {
        from: this.configService.get<string>(ENV_MAILER_EMAIL), 
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

  async generateRandomToken(min: number, max: number){
    const token = Math.floor(Math.random()* (max - min + 1))+min;
    const expires = new Date();
    expires.setHours(expires.getMinutes() +5); //5분 후 토큰 만료
    return {token,expires};
  }
}
