import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { IPayload } from 'src/shared/interfaces/IPayload.interface';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  // Validate user credentials (local)
  async validateUser(email: string, password: string) {
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check status of user
    // ...

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

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

    // Generate JWT token
    const token = this.generateJwtToken({ userId: newUser.id });

    return { user: newUser, token };
  }

  // Sign in a user handle logic when user is authenticated successfully (local - facebook - google)
  signIn(user: UserEntity) {
    // Generate JWT token
    const token = this.generateJwtToken({ userId: user.id });

    // Return user data and token
    return { user, token };
  }

  // Sign out a user (clear session or invalidate token)
  generateJwtToken(payload: IPayload): string {
    // In a real application, use environment variables for the secret and consider token expiration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return sign(payload, this.configService.get('JWT_SECRET') || 'key-secret', {
      expiresIn: '8h',
    });
  }
}
