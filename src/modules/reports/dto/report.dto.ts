import { Expose, Transform } from 'class-transformer';

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
  approved: boolean;

  @Transform(({ obj }) => obj.user?.id)
  @Expose()
  user: number;
}
