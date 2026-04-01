import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Serializer } from 'src/interceptors/serializer.interceptor';
import type { ISession } from 'src/shared/interfaces/ISession.interface';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { SignupUserDto } from './dtos/signup-user.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
@Serializer(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signupUserDto: SignupUserDto,
    @Session() session: ISession,
  ) {
    const { user, token } = await this.authService.singUp(
      signupUserDto.email,
      signupUserDto.password,
    );

    session.token = token;

    return user;
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signIn(
    @Body() signInDto: SigninUserDto, // Giữ lại cho ValidationPipe - Swagger
    @Session() session: ISession,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const { user, token } = this.authService.signIn(currentUser);
    session.token = token;
    return user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Post('signout')
  signOut(@Session() session: ISession) {
    session.token = null;
    return { message: 'Signed out successfully' };
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoami(@CurrentUser() user: UserEntity) {
    return user;
  }
}
