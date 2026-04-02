import { ReportEntity } from 'src/modules/reports/entities/report.entity';
import { BaseEntity } from 'src/shared/entities/Base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  // @Column({ default: false })
  // admin_: boolean;

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
