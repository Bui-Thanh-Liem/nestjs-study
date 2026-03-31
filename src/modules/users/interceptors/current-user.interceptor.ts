import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CurrentUserInterceptor.name);

  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const userId = req.session?.userId;

    //
    if (userId) {
      this.logger.debug(`userId: ${userId}`);
      const user = await this.usersService.findOne(userId);
      this.logger.debug(`Current user: ${JSON.stringify(user)}`);
      req.currentUser = user;
    }

    return next.handle();
  }
}
