import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { Repository } from 'typeorm';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { NotFoundException } from '@nestjs/common';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { Category } from 'src/types/Category.type';

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: jest.Mocked<Repository<Groups>>;
  let groupMembersRepository: jest.Mocked<Repository<GroupMembers>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Groups),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GroupMembers),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get(getRepositoryToken(Groups));
    groupMembersRepository = module.get(getRepositoryToken(GroupMembers));
  });

  describe('createGroup', () => {
    it('should successfully create a group and its main member', async () => {
      const createGroupDto: CreateGroupDto = {
        title: 'Test Group',
        content: 'Content here',
        category: Category.walk,
      };
      const userId = 1;
      const expectedGroup = {
        groupId: 1,
        ...createGroupDto,
      };
      const expectedGroupMember = {
        groupId: expectedGroup.groupId,
        userId,
        role: MemberRole.Main,
        isVailed: true,
        isInvited: true,
      };

      groupRepository.save.mockResolvedValue(expectedGroup);
      groupMembersRepository.save.mockResolvedValue(expectedGroupMember);

      const result = await service.createGroup(createGroupDto, userId);

      expect(groupRepository.save).toHaveBeenCalledWith(createGroupDto);
      expect(groupMembersRepository.save).toHaveBeenCalledWith(
        expectedGroupMember,
      );
      expect(result).toEqual(expectedGroup);
    });
  });

  describe('findAllGroups', () => {
    it('should return all groups', async () => {
      const expectedGroups = [
        {
          groupId: 1,
          title: 'Group 1',
          content: 'Content 1',
          category: 'Category 1',
        },
        {
          groupId: 2,
          title: 'Group 2',
          content: 'Content 2',
          category: 'Category 2',
        },
      ];
      groupRepository.find.mockResolvedValue(expectedGroups);

      const result = await service.findAllGroups();

      expect(groupRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedGroups);
    });
  });

  describe('findOneGroup', () => {
    it('should return a single group', async () => {
      const groupId = 1;
      const expectedGroup = {
        groupId,
        title: 'Group 1',
        content: 'Content 1',
        category: 'Category 1',
      };

      groupRepository.findOne.mockResolvedValue(expectedGroup);

      const result = await service.findOneGroup(groupId);

      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { groupId },
      });
      expect(result).toEqual(expectedGroup);
    });

    it('should throw a NotFoundException if the group does not exist', async () => {
      const groupId = 1;
      groupRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOneGroup(groupId)).rejects.toThrow(
        new NotFoundException('그룹이 존재하지 않습니다.'),
      );
    });
  });

  describe('updateGroup', () => {
    it('should update a group', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: Category.walk,
      };
      const existingGroup = {
        groupId,
        title: 'Old Title',
        content: 'Old Content',
        category: 'Old Category',
        isPublic: false,
      };

      groupRepository.findOne.mockResolvedValue(existingGroup);
      groupRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateGroup(groupId, updateGroupDto);

      expect(groupRepository.update).toHaveBeenCalledWith(
        groupId,
        updateGroupDto,
      );
      expect(result).toEqual({
        statusCode: 201,
        message: '성공적으로 그룹을 수정하였습니다.',
      });
    });

    it('should throw a NotFoundException if the group to update does not exist', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: Category.hiking,
      };

      groupRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.updateGroup(groupId, updateGroupDto),
      ).rejects.toThrow(new NotFoundException('그룹이 존재하지 않습니다.'));
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group', async () => {
      const groupId = 1;
      const existingGroup = {
        groupId,
        title: 'Group to Delete',
        content: 'Content to Delete',
        category: 'Category to Delete',
        isPublic: true,
      };

      groupRepository.findOne.mockResolvedValue(existingGroup);
      groupRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteGroup(groupId);

      expect(groupRepository.delete).toHaveBeenCalledWith(groupId);
      expect(result).toEqual({
        statusCode: 201,
        message: '성공적으로 그룹을 삭제하였습니다.',
      });
    });

    it('should throw a NotFoundException if the group to delete does not exist', async () => {
      const groupId = 1;
      groupRepository.findOne.mockResolvedValue(undefined);

      await expect(service.deleteGroup(groupId)).rejects.toThrow(
        new NotFoundException('그룹이 존재하지 않습니다.'),
      );
    });
  });
});
