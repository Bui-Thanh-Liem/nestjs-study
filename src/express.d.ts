import { UserEntity } from './modules/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserEntity | null;
      session?: {
        userId?: number | null;
        token?: string | null;
      };
    }
  }
}
