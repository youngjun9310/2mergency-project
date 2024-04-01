import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) 
    private userRepository : Repository<Users>,
    private readonly jwtService : JwtService){}
  async create(registerDto: RegisterDto) {
    const { nickname, email, password, address } = registerDto;
    const user = await this.userRepository.findOne({ where : { email }});
    const usernickname = await this.userRepository.findOne({ where : { nickname }});


    if(user || usernickname){
      throw new ConflictException("이미 존재하는 유저입니다.");
    }

    const usercreate = await this.userRepository.create({
      nickname,
      email,
      password,
      address
    })

    await this.userRepository.save(usercreate);

    return usercreate;
  }

  async login (email : string, password : string) {
    const user = await this.userRepository.findOne({ where : { email },
    select : ['userId', 'email', 'password'] })

    if(user === null) {
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(password !== user.password) {
      throw new NotFoundException("패스워드가 일치하지 않습니다.");
    }

    const payload = { email, user };
    console.log(payload)
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      

  async findEmail (email : string, password : string) {
    const useremail = await this.userRepository.findOne({ where : { email },
    select : ['password']});

    return useremail;
  }

}
