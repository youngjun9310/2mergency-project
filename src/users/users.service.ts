import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepository : Repository<Users>){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(userId: string) {
    return this.userRepository.findOne({ where : { userId }});
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.findOne({ where : { userId }});
  }

  remove(userId: string) {
    return ;
  }

  async findByEmail (email : string) {
    const user = await this.userRepository.findOne({ where : { email } });
    if(user){
      throw new Error("유저가 존재하지 않습니다.");
    }
    return user;
  }

}
