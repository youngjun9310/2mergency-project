import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository } from 'typeorm';
import { Groups } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Groups) private groupRepository : Repository<Groups>){}
  async create(createGroupDto: CreateGroupDto) {
    const { title, content, category } = createGroupDto;

    const groupcreate = await this.groupRepository.create({
      title,
      content,
      category
    })

    await this.groupRepository.save(groupcreate);
    
    return groupcreate;
  }

  async findAll() {
    return await this.groupRepository.find();
  }

  async findOne(groupId: number) {
    const groups = await this.groupRepository.findOne({ where : { groupId } });

    if(!groups){
      throw new NotFoundException("그룹이 존재하지 않습니다.");
    }

    

    return groups;
  }

  async update(groupId: number, updateGroupDto: UpdateGroupDto) {
    const { title, content, category, isPublic } = updateGroupDto;
    const groups = await this.groupRepository.findOne({ where : { groupId }});

    if(!groups){
      throw new NotFoundException("그룹이 존재하지 않습니다.");
    }

    const groupupdate = await this.groupRepository.update(groupId,{
      title,
      content,
      category,
      isPublic
    })
    
    return groupupdate;
  }

  async remove(groupId: number) {
    const groups = await this.groupRepository.findOne({ where : { groupId }});

    if(!groups){
      throw new NotFoundException("그룹이 존재하지 않습니다.");
    }

    const groupdelete = await this.groupRepository.delete(groupId);

    return groupdelete;
  }
}
