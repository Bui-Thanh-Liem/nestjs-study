import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  //
  const _userRepository = {
    create: jest.fn().mockImplementation((dto: CreateUserDto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: '1', ...user })),
    findOneBy: jest
      .fn()
      .mockResolvedValue({ id: '1', email: 'test@gmail.com' }),
    find: jest.fn().mockResolvedValue([]),
    merge: jest.fn().mockImplementation(
      (user, dto: UpdateUserDto): Promise<UserEntity | null> => ({
        ...user,
        ...dto,
      }),
    ),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  //
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: _userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
