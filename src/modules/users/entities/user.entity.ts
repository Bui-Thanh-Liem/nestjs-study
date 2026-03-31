import { Exclude } from 'class-transformer';
import { ReportEntity } from 'src/modules/reports/entities/report.entity';
import { BaseEntity } from 'src/shared/Base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

console.log('ReportEntity:::', ReportEntity);

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  logInsert() {
    console.log(
      `Đã chèn thành công User có ID: ${this.id} - Email: ${this.email}`,
    );
  }

  logUpdate(): void {
    console.log(
      `Đã cập nhật thành công User có ID: ${this.id} - Email: ${this.email}`,
    );
  }

  logRemove(): void {
    console.log(
      `Đã xóa thành công User có ID: ${this.id} - Email: ${this.email}`,
    );
  }
}
