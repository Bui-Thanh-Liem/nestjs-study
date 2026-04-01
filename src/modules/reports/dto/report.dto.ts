import { Expose, Transform } from 'class-transformer';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }: { obj: { user: UserEntity } }) => obj.user.id)
  @Expose()
  user: number;
}
