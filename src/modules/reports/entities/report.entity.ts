import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/entities/Base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('reports')
export class ReportEntity extends BaseEntity {
  @Column({ type: 'float', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 255 })
  make: string;

  @Column({ length: 255 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'float', precision: 10, scale: 2 })
  mileage: number;

  @Column({ type: 'float', precision: 10, scale: 2 })
  lng: number;

  @Column({ type: 'float', precision: 10, scale: 2 })
  lat: number;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  user: UserEntity;

  logInsert(): void {
    console.log(
      `Đã chèn thành công Report có ID: ${this.id} - Title: ${this.model} ${this.make} (${this.year})`,
    );
  }
  logUpdate(): void {
    console.log(
      `Đã cập nhật thành công Report có ID: ${this.id} - Title: ${this.model} ${this.make} (${this.year})`,
    );
  }
  logRemove(): void {
    console.log(
      `Đã xóa thành công Report có ID: ${this.id} - Title: ${this.model} ${this.make} (${this.year})`,
    );
  }
}
