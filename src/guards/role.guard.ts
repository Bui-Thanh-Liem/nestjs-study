import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as UserEntity;
    this.logger.debug('Validating user role:::', user && user.admin === true);
    return user && user.admin === true;
  }
}
