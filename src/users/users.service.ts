import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findBy({ email });
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

  async findOne(id: string) {
    return await this.userRepo.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return null;
    }

    const updatedUser = this.userRepo.merge(user, updateUserDto);
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return null;
    }

    // await this.userRepo.delete(id); // command SQL
    return await this.userRepo.remove(user);
  }
}
