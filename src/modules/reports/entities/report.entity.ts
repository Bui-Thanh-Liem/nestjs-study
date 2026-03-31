import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/Base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

console.log('UserEntity:::', UserEntity);

@Entity('reports')
export class ReportEntity extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  user: UserEntity;

  logInsert(): void {
    console.log(
      `Đã chèn thành công Report có ID: ${this.id} - Title: ${this.title}`,
    );
  }
  logUpdate(): void {
    console.log(
      `Đã cập nhật thành công Report có ID: ${this.id} - Title: ${this.title}`,
    );
  }
  logRemove(): void {
    console.log(
      `Đã xóa thành công Report có ID: ${this.id} - Title: ${this.title}`,
    );
  }
}
