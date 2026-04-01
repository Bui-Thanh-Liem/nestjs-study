import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.initializeAdminUser();
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  findAll({
    page,
    limit,
    email,
  }: {
    page: string;
    limit: string;
    email?: string;
  }) {
    return this.userRepo.find({
      where: email ? { email } : {},
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });
  }

  async findOne(id: number) {
    if (!id) return null;
    return await this.userRepo.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return null;
    }

    const updatedUser = this.userRepo.merge(user, updateUserDto);
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return null;
    }

    // await this.userRepo.delete(id); // command SQL
    return await this.userRepo.remove(user);
  }

  private async initializeAdminUser() {
    const adminEmail = 'liemdev@gmail.com';
    const user = await this.findByEmail(adminEmail);

    if (!user) {
      //
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash('admin123', salt);

      //
      const adminUser = this.userRepo.create({
        email: adminEmail,
        password: hashPassword,
        admin: true,
      });
      await this.userRepo.save(adminUser);
      console.log('Admin user created with email:', adminUser.email);
    } else {
      console.log('Admin user already exists with email:', adminEmail);
    }
  }
}
