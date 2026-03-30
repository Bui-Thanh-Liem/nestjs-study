import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
// import bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

// jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  // Mock UsersService
  const _userService: Partial<UsersService> = {
    create: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findByEmail: jest.fn().mockResolvedValue({
      id: 1,
      email: '',
      password: '',
    }),
  };

  //
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: _userService,
        },
      ],
    }).compile();

    // Khởi tạo lại service từ module vừa compile
    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  // ===== Case: AuthService is defined =====
  it('should be defined - AuthService', () => {
    expect(service).toBeDefined();
  });

  // ===== Case: UsersService is defined =====
  it('should be defined - UsersService', () => {
    expect(usersService).toBeDefined();
  });

  // ===== Case: User already exists =====
  it('throw error if user already exists', async () => {
    // Override
    _userService.findByEmail = jest.fn().mockImplementationOnce(
      (dto) =>
        ({
          id: 1,
          ...dto,
        }) as UserEntity,
    );

    await expect(service.singUp('test@test.com', 'password')).rejects.toThrow(
      ConflictException,
    );
  });

  // ==== Case: Ensure password is hashed =====
  it('should hash the password before saving', async () => {
    // Override
    _userService.findByEmail = jest.fn().mockResolvedValue(null);

    //
    const newUser = await service.singUp('test2@test.com', 'password');
    expect(newUser.password).not.toEqual('password');
  });
});
