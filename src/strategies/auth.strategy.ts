import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { IPayload } from 'src/shared/interfaces/IPayload.interface';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtAuthStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;

          if (req.session?.token) {
            token = req.session.token;
          }

          this.logger.debug('Extracting JWT from session:::', token);
          return token;
        },
      ]),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secretOrKey: configService.get('JWT_SECRET') || 'key-secret',
    });
  }

  async validate(payload: IPayload): Promise<unknown> {
    // check in database (cached) if user exists and is valid
    const user = await this.userService.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');

    //
    this.logger.debug('Validating JWT payload:::', payload);
    return user;
  }
}
