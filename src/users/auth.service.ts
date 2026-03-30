import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersService } from './users.service';

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

  async signIn(email: string, password: string) {
    //
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    //
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
