import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async singUp(email: string, password: string) {
    //
    const user = await this.usersService.findByEmail(email);
    if (user) throw new ConflictException('User already exists');

    //
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //
    const newUser = await this.usersService.create({
      email,
      name: '',
      password: hashPassword,
    });

    return newUser;
  }

  signIn() {}
}
